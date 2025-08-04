const validateEmployeeChangePassword = require('../../src/validationator/validateEmployeeChangePassword');
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

  const middlewareChain = validateEmployeeChangePassword();

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

describe('validateEmployeeChangePassword', () => {
  test('should pass validation with valid input', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
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
      oldPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      invalidKey: 'someValue',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['Properti yang tidak diizinkan terdeteksi: invalidKey. Hanya oldPassword, newPassword yang diizinkan.'],
    });
  });

  test('should fail if oldPassword is empty', async () => {
    const req = mockRequest({
      oldPassword: '',
      newPassword: 'NewPassword123!',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['oldPassword cannot be empty.'],
    });
  });

  test('should fail if oldPassword is not a string', async () => {
    const req = mockRequest({
      oldPassword: 12345678,
      newPassword: 'NewPassword123!',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['oldPassword type must be string.'],
    });
  });

  test('should fail if newPassword is empty', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: '',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['newPassword cannot be empty.'],
    });
  });

  test('should fail if newPassword is not a string', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 12345678,
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['newPassword type must be string.'],
    });
  });

  test('should fail if newPassword is too short', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'N1!',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['Passwordnya kurang panjang anjing!!!'],
    });
  });

  test('should fail if newPassword is too long', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'N1!N1!N1!N1!N1!N1!N1!N1!N1!N1!', // 26 characters
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['Yang ini kepanjangan tolol!!!'],
    });
  });

  test('should fail if newPassword does not contain a number', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'NewPassword!!',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['newPassword must contain at least one number.'],
    });
  });

  test('should fail if newPassword does not contain an uppercase letter', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'newpassword123!',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['newPassword must contain at least one uppercase letter.'],
    });
  });

  test('should fail if newPassword does not contain a lowercase letter', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'NEWPASSWORD123!',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['newPassword must contain at least one lowercase letter.'],
    });
  });

  test('should fail if newPassword does not contain a special character', async () => {
    const req = mockRequest({
      oldPassword: 'OldPassword123!',
      newPassword: 'NewPassword123',
    });

    const { res, next, validationErrors } = await runValidation(req);

    expect(validationErrors).toBe(true);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: ['newPassword must contain at least one special character (@, $, !, %, *, ?, &).'],
    });
  });
});