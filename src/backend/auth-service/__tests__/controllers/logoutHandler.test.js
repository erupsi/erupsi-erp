const logoutHandler = require('../../src/controllers/logoutHandler');
const { deleteToken } = require('../../src/services/RefreshToken');

// Mock dependensi
jest.mock('../../src/services/RefreshToken');

describe('logoutHandler Controller', () => {
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
    sendStatus: jest.fn(),
    clearCookie: jest.fn(),
  };

  beforeEach(() => {
    // Reset mock-mock sebelum setiap test
    jest.clearAllMocks();
  });

  // --- Skenario Berhasil ---
  test('should successfully delete token and return 200 with success message', async () => {
    const mockRequest = {
      cookies: {
        refreshToken: 'mock-refresh-token',
      },
    };
    
    // Mock deleteToken service call to succeed
    deleteToken.mockResolvedValue(true);

    await logoutHandler(mockRequest, mockResponse, null);

    // Verifikasi bahwa deleteToken dipanggil dengan benar
    expect(deleteToken).toHaveBeenCalledWith('mock-refresh-token');
    
    // Verifikasi bahwa cookie dihapus
    expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Logout successful' });
  });

  // --- Skenario Token Tidak Ada ---
  test('should return 204 if no refreshToken cookie is present', async () => {
    const mockRequest = {
      cookies: {},
    };

    await logoutHandler(mockRequest, mockResponse, null);

    // Verifikasi bahwa sendStatus 204 dipanggil
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
    
    // Verifikasi bahwa deleteToken tidak dipanggil
    expect(deleteToken).not.toHaveBeenCalled();
    // Verifikasi bahwa clearCookie tidak dipanggil
    expect(mockResponse.clearCookie).not.toHaveBeenCalled();
  });

  // --- Skenario Kesalahan Internal Server ---
  test('should return 500 for an internal server error', async () => {
    const mockRequest = {
      cookies: {
        refreshToken: 'mock-refresh-token',
      },
    };
    
    // Mock deleteToken service call to throw an error
    deleteToken.mockRejectedValue(new Error('Database connection failed'));

    await logoutHandler(mockRequest, mockResponse, null);

    // Verifikasi respons yang diberikan
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(mockResponse.clearCookie).not.toHaveBeenCalled();
  });
});