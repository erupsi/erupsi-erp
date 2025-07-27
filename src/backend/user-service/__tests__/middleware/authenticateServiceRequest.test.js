// Import fungsi yang akan diuji
const authenticateServiceRequest = require('../../src/middlewares/authenticateServiceRequest'); 
// Import library jwt untuk di-mock
const jwt = require('jsonwebtoken');

// Mock library jsonwebtoken
jest.mock('jsonwebtoken');

// Mock process.env untuk mengisolasi tes dari file .env asli
process.env.PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\nFAKE_PUBLIC_KEY\n-----END PUBLIC KEY-----';

describe('authenticateServiceRequest Middleware', () => {

  let mockRequest;
  let mockResponse;
  let nextFunction;

  // Atur ulang mock object sebelum setiap tes dijalankan
  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    // Mock fungsi response Express
    mockResponse = {
      status: jest.fn().mockReturnThis(), // Memungkinkan chaining .status().json()
      json: jest.fn(),
    };
    // Mock fungsi next Express
    nextFunction = jest.fn();
  });
  
  // Bersihkan semua mock setelah setiap tes
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= Skenario Sukses (Happy Paths) =================

  test('should call next() when a valid token is provided', async () => {
    const mockToken = 'valid.token.here';
    const decodedPayload = { role: ['USER'], aud: 'urm-service', iss: 'auth-service' };

    mockRequest.headers['authorization'] = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(decodedPayload); // Simulasikan verifikasi token yang berhasil

    // Jalankan middleware
    await authenticateServiceRequest()(mockRequest, mockResponse, nextFunction);

    // Assertions
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledTimes(1); // next() harus dipanggil
    expect(mockResponse.status).not.toHaveBeenCalled(); // Tidak boleh ada response error
  });

  test('should call next() when useRole is true and token has SYSTEM_ADMIN role', async () => {
    const mockToken = 'valid.admin.token.here';
    const decodedPayload = { role: ['USER', 'SYSTEM_ADMIN'], aud: 'urm-service', iss: 'auth-service' };
    
    mockRequest.headers['authorization'] = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(decodedPayload);

    // Jalankan middleware dengan opsi useRole: true
    await authenticateServiceRequest({ useRole: true })(mockRequest, mockResponse, nextFunction);

    // Assertions
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });


  // ================= Skenario Gagal (Sad Paths) =================

  test('should return 401 if authorization header is missing', async () => {
    await authenticateServiceRequest()(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Authentication token required" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 401 if token format is not "Bearer <token>"', async () => {
    mockRequest.headers['authorization'] = 'InvalidFormatToken'; // Format salah

    await authenticateServiceRequest()(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token format is 'Bearer <token>" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 401 for an invalid or malformed token', async () => {
    const mockToken = 'invalid.token';
    mockRequest.headers['authorization'] = `Bearer ${mockToken}`;

    // Simulasikan jwt.verify melempar error umum
    const error = new Error("Invalid signature");
    jwt.verify.mockImplementation(() => {
      throw error;
    });

    await authenticateServiceRequest()(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid or malformed token" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 401 if token is expired', async () => {
    const mockToken = 'expired.token';
    mockRequest.headers['authorization'] = `Bearer ${mockToken}`;

    // Simulasikan jwt.verify melempar error TokenExpiredError
    const error = new Error("Token expired");
    error.name = 'TokenExpiredError';
    jwt.verify.mockImplementation(() => {
      throw error;
    });

    await authenticateServiceRequest()(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Token expired" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 403 if useRole is true and token does not have SYSTEM_ADMIN role', async () => {
    const mockToken = 'valid.user.token.here';
    const decodedPayload = { role: ['USER'], aud: 'urm-service', iss: 'auth-service' };

    mockRequest.headers['authorization'] = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(decodedPayload);

    await authenticateServiceRequest({ useRole: true })(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Access denied: Admin privileges required" });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 403 if useRole is true and token has no role property', async () => {
    const mockToken = 'valid.token.no.role';
    const decodedPayload = { user_id: 123, aud: 'urm-service', iss: 'auth-service' }; // Tidak ada properti 'role'

    mockRequest.headers['authorization'] = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(decodedPayload);

    await authenticateServiceRequest({ useRole: true })(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Access denied: Admin privileges required" });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});