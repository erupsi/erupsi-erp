const adminResetPassword = require('../../src/controllers/adminResetPassword');
const { changeEmployeePassword } = require('../../src/services/authService');
const { bcryptSalting } = require('../../src/utils/passwordUtils');

// Mock semua dependensi yang digunakan
jest.mock('../../src/services/authService');
jest.mock('../../src/utils/passwordUtils');

describe('adminResetPassword Controller', () => {
  const mockRequest = {
    body: {
      username: 'testuser',
      password: 'newPassword123!',
    },
  };
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  const hashedPassword = 'mockHashedPassword';

  beforeEach(() => {
    // Reset mock-mock sebelum setiap test
    jest.clearAllMocks();
  });

  // --- Skenario Berhasil ---
  test('should successfully reset password and return 201', async () => {
    // Siapkan mock untuk skenario sukses
    bcryptSalting.mockResolvedValue(hashedPassword);
    changeEmployeePassword.mockResolvedValue({ success: true });

    await adminResetPassword(mockRequest, mockResponse, mockNext);

    // Verifikasi bahwa bcryptSalting dipanggil dengan benar
    expect(bcryptSalting).toHaveBeenCalledWith(mockRequest.body.password);
    
    // Verifikasi bahwa changeEmployeePassword dipanggil dengan benar
    expect(changeEmployeePassword).toHaveBeenCalledWith(
      mockRequest.body.username,
      hashedPassword,
      // Memastikan argumen tanggal adalah objek Date dan dalam rentang yang wajar (sekitar 1 hari dari sekarang)
      expect.any(Date) 
    );
    
    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
  });

  // --- Skenario Gagal Memperbarui Password ---
  test('should return 500 if changeEmployeePassword service fails', async () => {
    // Siapkan mock untuk skenario gagal
    bcryptSalting.mockResolvedValue(hashedPassword);
    changeEmployeePassword.mockResolvedValue(null); // Atau { success: false } tergantung implementasi

    await adminResetPassword(mockRequest, mockResponse, mockNext);

    // Verifikasi bahwa kedua fungsi service tetap dipanggil
    expect(bcryptSalting).toHaveBeenCalledTimes(1);
    expect(changeEmployeePassword).toHaveBeenCalledTimes(1);
    
    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  // --- Skenario Kesalahan Internal Server ---
  test('should return 500 for an unexpected internal error', async () => {
    // Siapkan mock untuk throw error
    bcryptSalting.mockRejectedValue(new Error('Hashing failed'));

    await adminResetPassword(mockRequest, mockResponse, mockNext);

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});