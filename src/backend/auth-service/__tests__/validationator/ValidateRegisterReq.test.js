const validateRegisterReq = require('../../src/validationator/validateRegisterReq');
const { body } = require('express-validator');

// Mock request and response objects for testing
const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

// A helper function to run the middleware chain correctly
const runValidation = async (req) => {
  const res = mockResponse();
  const next = jest.fn();

  const middlewareChain = validateRegisterReq();

  for (let i = 0; i < middlewareChain.length - 1; i++) {
    const middleware = middlewareChain[i];
    await new Promise((resolve) => {
      middleware(req, res, () => {
        resolve();
      });
    });
  }

  const finalMiddleware = middlewareChain[middlewareChain.length - 1];
  await finalMiddleware(req, res, next);
  
  const validationErrors = res.status.mock.calls.length > 0;
  return { res, next, validationErrors };
};

describe('validateRegisterReq', () => {
  test('should pass validation with valid input', async () => {
    const req = mockRequest({
      username: 'johndoe',
      password: 'Password123!',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      position: 'Developer',
      roleName: 'user',
      passwordExpiry: '2025-12-31T23:59:59.999Z',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(false);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // --- Failed Cases ---
  
  test('should fail if body contains an invalid key', async () => {
    const req = mockRequest({
      username: 'johndoe',
      password: 'Password123!',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      position: 'Developer',
      roleName: 'user',
      passwordExpiry: '2025-12-31T23:59:59.999Z',
      invalidKey: 'someValue',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['Properti yang tidak diizinkan terdeteksi: invalidKey. Hanya username, password, fullName, email, department, position, roleName, passwordExpiry yang diizinkan.'],
    });
  });

  test('should fail if username is empty', async () => {
    const req = mockRequest({
      username: '',
      password: 'Password123!',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      position: 'Developer',
      roleName: 'user',
      passwordExpiry: '2025-12-31T23:59:59.999Z',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['username cannot be empty.'],
    });
  });

  test('should fail if email is invalid', async () => {
    const req = mockRequest({
      username: 'johndoe',
      password: 'Password123!',
      fullName: 'John Doe',
      email: 'invalid-email',
      department: 'IT',
      position: 'Developer',
      roleName: 'user',
      passwordExpiry: '2025-12-31T23:59:59.999Z',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['email type invalid.'],
    });
  });

  test('should fail if passwordExpiry is not a valid ISO8601 date', async () => {
    const req = mockRequest({
      username: 'johndoe',
      password: 'Password123!',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      position: 'Developer',
      roleName: 'user',
      passwordExpiry: 'not-a-date',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['passwordExpiry type ISO8601.'],
    });
  });

  test('should fail with multiple errors for empty fields', async () => {
    const req = mockRequest({
      username: '',
      password: '',
      fullName: '',
      email: '',
      department: '',
      position: '',
      roleName: '',
      passwordExpiry: '',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: [
        'username cannot be empty.',
        'password cannot be empty.',
        'fullName cannot be empty.',
        'Email cannot be empty.',
        'department cannot be empty.',
        'position cannot be empty.',
        'roleName cannot be empty.',
        'passwordExpiry cannot be empty.',
      ],
    });
  });
});