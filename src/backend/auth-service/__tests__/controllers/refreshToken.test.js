// __tests__/controllers/refreshTokenRenewal.test.js

// 1. Mock semua modul dependensi di bagian paling atas
jest.mock('../../src/services/RefreshToken');
jest.mock('../../src/services/authService');

// 2. Impor fungsi/modul yang sudah di-mock untuk bisa kita kendalikan
const {
  searchRefreshToken,
  deleteTokenByEmpId,
  deleteToken,
  tokenBuilderAssigner,
  invalidateAndInsertToken
} = require('../../src/services/RefreshToken');
const { getEmployeeDataFromUrm, getEmployeeUsername } = require('../../src/services/authService');

// 3. Impor fungsi controller yang akan diuji
const refreshAccessToken = require('../../src/controllers/refreshTokenRenewal');


describe('Controller: refreshAccessToken', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  // Setup objek mock dasar yang akan digunakan di setiap tes
  beforeEach(() => {
    // Reset semua mock untuk memastikan setiap tes berjalan secara terisolasi
    jest.clearAllMocks();

    mockRequest = {
      cookies: {}, // Akan diisi di setiap tes sesuai skenario
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(), // .mockReturnThis() memungkinkan chaining (cth: res.status(200).json(...))
      json: jest.fn(),
      cookie: jest.fn(),
    };

    mockNext = jest.fn();
  });

  // =================================================================
  // Skenario Gagal (Sad Paths)
  // =================================================================

  test('should return 401 if refresh token is not found in cookies', async () => {
    // Arrange: Tidak ada cookie refreshToken
    mockRequest.cookies = {};

    // Act: Panggil controller
    await refreshAccessToken(mockRequest, mockResponse, mockNext);

    // Assert: Periksa respons yang diharapkan
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token not found' });
  });

  test('should return 403 if refresh token is not found in the database', async () => {
    // Arrange: Cookie ada, tapi service tidak menemukan data token
    mockRequest.cookies.refreshToken = 'nonexistent-token';
    searchRefreshToken.mockResolvedValue([]); // Mensimulasikan token tidak ditemukan

    // Act
    await refreshAccessToken(mockRequest, mockResponse, mockNext);

    // Assert
    expect(searchRefreshToken).toHaveBeenCalledWith('nonexistent-token');
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token. Please login again.' });
  });

  test('should return 403 and delete user tokens if the token is marked as invalid', async () => {
    // Arrange: Token ditemukan tapi tidak valid (is_valid: false)
    const mockTokenData = {
      employee_id: 'emp-123',
      is_valid: false,
    };
    mockRequest.cookies.refreshToken = 'invalid-token';
    searchRefreshToken.mockResolvedValue([mockTokenData]);

    // Act
    await refreshAccessToken(mockRequest, mockResponse, mockNext);

    // Assert
    expect(searchRefreshToken).toHaveBeenCalledWith('invalid-token');
    // Pastikan fungsi untuk menghapus semua token user tersebut dipanggil
    expect(deleteTokenByEmpId).toHaveBeenCalledWith('emp-123');
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ Error: 'Invalid token. Please login again.' });
  });

  test('should return 403 and delete the token if it has expired', async () => {
    // Arrange: Token ditemukan, valid, tapi sudah kedaluwarsa
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1); // Set waktu 1 jam yang lalu
    
    const mockTokenData = {
      id: 1,
      employee_id: 'emp-123',
      is_valid: true,
      expires_at: pastDate.toISOString(),
    };
    mockRequest.cookies.refreshToken = 'expired-token';
    searchRefreshToken.mockResolvedValue([mockTokenData]);

    // Act
    await refreshAccessToken(mockRequest, mockResponse, mockNext);

    // Assert
    expect(searchRefreshToken).toHaveBeenCalledWith('expired-token');
    // Pastikan token yang kedaluwarsa dihapus
    expect(deleteToken).toHaveBeenCalledWith('expired-token');
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token expired. Please login again.' });
  });


  test('should return 500 if there is an internal server error', async () => {
    // Arrange: Simulasikan error dari salah satu service
    const errorMessage = 'Database connection lost';
    mockRequest.cookies.refreshToken = 'valid-token';
    searchRefreshToken.mockRejectedValue(new Error(errorMessage));

    // Act
    await refreshAccessToken(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  // =================================================================
  // Skenario Sukses (Happy Path)
  // =================================================================

  test('should successfully refresh the token and return a new access token', async () => {
    // Arrange: Siapkan semua data mock untuk skenario sukses
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1); // Set waktu 1 jam ke depan

    const mockTokenData = {
      id: 1,
      employee_id: 'emp-123',
      is_valid: true,
      expires_at: futureDate.toISOString(),
    };
    mockRequest.cookies.refreshToken = 'valid-token';

    // Konfigurasi semua mock service untuk mengembalikan data yang valid
    searchRefreshToken.mockResolvedValue([mockTokenData]);
    getEmployeeDataFromUrm.mockResolvedValue({ data: { roles: ['admin', 'user'] } });
    getEmployeeUsername.mockResolvedValue('testuser');
    tokenBuilderAssigner.mockResolvedValue({
      accessToken: 'new-access-token-123',
      refreshToken: 'new-refresh-token-456',
    });
    invalidateAndInsertToken.mockResolvedValue(undefined); // Asumsi tidak mengembalikan apa-apa

    // Act
    await refreshAccessToken(mockRequest, mockResponse, mockNext);

    // Assert: Periksa urutan dan hasil dari semua pemanggilan
    // 1. Mencari token
    expect(searchRefreshToken).toHaveBeenCalledWith('valid-token');
    // 2. Mengambil data & role user
    expect(getEmployeeDataFromUrm).toHaveBeenCalledWith('emp-123');
    // 3. Mengambil username
    expect(getEmployeeUsername).toHaveBeenCalledWith('emp-123');
    // 4. Membuat token baru
    expect(tokenBuilderAssigner).toHaveBeenCalledWith(mockResponse, 'emp-123', 'testuser', ['admin', 'user']);
    // 5. Membatalkan token lama dan memasukkan token baru
    expect(invalidateAndInsertToken).toHaveBeenCalledWith(
        mockTokenData.id,
        'new-refresh-token-456', // refreshToken baru dari tokenBuilderAssigner
        mockTokenData.employee_id,
        expect.any(Date) // Kita cek apakah argumennya adalah sebuah Date
    );
    // 6. Mengatur cookie baru
    expect(mockResponse.cookie).toHaveBeenCalledWith('refreshToken', 'new-refresh-token-456', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000
    });
    // 7. Mengirimkan respons sukses
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      accessToken: 'new-access-token-123',
    });
  });
});