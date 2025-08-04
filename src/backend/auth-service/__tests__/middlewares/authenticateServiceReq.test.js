const jwt = require('jsonwebtoken');
const authenticateServiceReq = require('../../src/middlewares/authenticateServiceReq'); // Sesuaikan path jika perlu

// Mock request and response objects
const mockRequest = (token = null) => {
  const req = {};
  req.headers = {};
  if (token) {
    req.headers['authorization'] = `Bearer ${token}`;
  }
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

const mockNext = jest.fn();

// Mock the jwt module to control its behavior
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn(),
  TokenExpiredError: jest.requireActual('jsonwebtoken').TokenExpiredError,
}));

describe('authenticateServiceReq Middleware', () => {

  beforeEach(() => {
    // Clear mocks before each test
    jwt.verify.mockClear();
    mockNext.mockClear();
  });

  // --- Skenario Token Valid ---
  test('should call next() for a valid token', async () => {
    // Mock the decoded payload
    const decodedPayload = { userId: '123', roles: ['SYSTEM_ADMIN'] };
    jwt.verify.mockReturnValue(decodedPayload);

    const req = mockRequest('valid-token');
    const res = mockResponse();
    const middleware = authenticateServiceReq();
    
    await middleware(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  // --- Skenario Tanpa Token ---
  test('should return 401 if no authorization header is present', async () => {
    const req = mockRequest(null);
    const res = mockResponse();
    const middleware = authenticateServiceReq();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication token required!' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- Skenario Format Token Salah ---
  test('should return 401 if token format is invalid', async () => {
    const req = { headers: { authorization: 'InvalidTokenFormat' } };
    const res = mockResponse();
    const middleware = authenticateServiceReq();

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token format is \'Bearer <token>' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- Skenario Token Tidak Valid ---
  test('should return 401 for an invalid token', async () => {
    const req = mockRequest('invalid-token');
    const res = mockResponse();
    const middleware = authenticateServiceReq();
    
    // Simulate jwt.verify throwing a generic error for invalid token
    jwt.verify.mockImplementation(() => {
      throw new Error('JsonWebTokenError');
    });

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or malformed token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- Skenario Token Kadaluwarsa ---
  test('should return 401 for an expired token', async () => {
    const req = mockRequest('expired-token');
    const res = mockResponse();
    const middleware = authenticateServiceReq();
    
    // Simulate jwt.verify throwing a TokenExpiredError
    jwt.verify.mockImplementation(() => {
      throw new jwt.TokenExpiredError('jwt expired', new Date());
    });

    await middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token Required: Your Token already expired' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // --- Skenario Opsi useRole: true ---
  describe('with useRole option', () => {
    const adminRoles = { userId: '123', roles: ['SYSTEM_ADMIN'] };
    const nonAdminRoles = { userId: '456', roles: ['USER'] };
    const missingRoles = { userId: '789' };

    test('should call next() for a user with SYSTEM_ADMIN role', async () => {
      jwt.verify.mockReturnValue(adminRoles);

      const req = mockRequest('admin-token');
      const res = mockResponse();
      const middleware = authenticateServiceReq({ useRole: true });

      await middleware(req, res, mockNext);

      expect(res.status).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    test('should return 401 for a user without SYSTEM_ADMIN role', async () => {
      jwt.verify.mockReturnValue(nonAdminRoles);

      const req = mockRequest('non-admin-token');
      const res = mockResponse();
      const middleware = authenticateServiceReq({ useRole: true });

      await middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied: Admin privileges required' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 if token has no roles property', async () => {
      jwt.verify.mockReturnValue(missingRoles);

      const req = mockRequest('no-roles-token');
      const res = mockResponse();
      const middleware = authenticateServiceReq({ useRole: true });

      await middleware(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access denied: Admin privileges required' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});