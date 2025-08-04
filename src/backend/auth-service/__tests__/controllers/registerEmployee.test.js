const registerEmployee = require('../../src/controllers/registerEmployee');
const { v4: uuidv4 } = require('uuid');
const authService = require('../../src/services/authService');

// Mock dependensi
jest.mock('uuid');
jest.mock('../../src/services/authService');

describe('registerEmployee Controller', () => {
  const mockRequest = {
    body: {
      username: 'testuser',
      password: 'password123',
      fullName: 'Test User',
      email: 'test@example.com',
      department: 'IT',
      position: 'Developer',
      roleName: 'user',
      passwordExpiry: '2024-12-31T23:59:59.999Z',
    },
  };
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    // Reset mock-mock sebelum setiap test
    jest.clearAllMocks();
  });

  // --- Skenario Berhasil ---
  test('should return 200 with success message on successful registration', async () => {
    // Siapkan mock untuk skenario sukses
    uuidv4.mockReturnValue('mock-uuid-123');
    authService.AddEmployeeRequestToUrm.mockResolvedValue({ success: true });
    authService.registerUser.mockResolvedValue({ success: true });

    await registerEmployee(mockRequest, mockResponse, mockNext);

    // Verifikasi bahwa fungsi-fungsi dipanggil dengan benar
    expect(uuidv4).toHaveBeenCalledTimes(1);
    expect(authService.AddEmployeeRequestToUrm).toHaveBeenCalledWith(
      'mock-uuid-123',
      mockRequest.body.fullName,
      mockRequest.body.email,
      mockRequest.body.department,
      mockRequest.body.position,
      mockRequest.body.roleName
    );
    expect(authService.registerUser).toHaveBeenCalledWith(
      'mock-uuid-123',
      mockRequest.body.username,
      mockRequest.body.password,
      mockRequest.body.passwordExpiry
    );

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pegawai berhasil didaftarkan' });
  });

  // --- Skenario Gagal Menambahkan ke URM ---
  test('should return 400 if AddEmployeeRequestToUrm fails', async () => {
    // Siapkan mock untuk skenario gagal di URM
    uuidv4.mockReturnValue('mock-uuid-123');
    authService.AddEmployeeRequestToUrm.mockResolvedValue({ success: false });

    await registerEmployee(mockRequest, mockResponse, mockNext);

    // Verifikasi bahwa registerUser tidak dipanggil
    expect(authService.AddEmployeeRequestToUrm).toHaveBeenCalledTimes(1);
    expect(authService.registerUser).not.toHaveBeenCalled();

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Gagal menambahkan data pegawai ke URM' });
  });

  // --- Skenario Gagal Mendaftarkan User ---
  test('should return 400 if registerUser fails', async () => {
    // Siapkan mock untuk skenario gagal di registerUser
    uuidv4.mockReturnValue('mock-uuid-123');
    authService.AddEmployeeRequestToUrm.mockResolvedValue({ success: true });
    authService.registerUser.mockResolvedValue({ success: false });

    await registerEmployee(mockRequest, mockResponse, mockNext);

    // Verifikasi bahwa kedua fungsi dipanggil
    expect(authService.AddEmployeeRequestToUrm).toHaveBeenCalledTimes(1);
    expect(authService.registerUser).toHaveBeenCalledTimes(1);

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Gagal menambahkan data pegawai ke URM' });
  });

  // --- Skenario Kesalahan Server ---
  test('should return 500 for an internal server error', async () => {
    // Siapkan mock untuk throw error
    authService.AddEmployeeRequestToUrm.mockRejectedValue(new Error('Database connection failed'));

    await registerEmployee(mockRequest, mockResponse, mockNext);

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Terjadi kesalahan internal server.' });
  });
});