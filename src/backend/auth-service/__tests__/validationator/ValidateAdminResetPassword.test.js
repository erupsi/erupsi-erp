const validateAdminResetPassword =
require("../../src/validationator/validateAdminResetPassword");
// const {body} = require("express-validator");

// Mock request and response objects for testing
const mockRequest = (body) => ({body});
const mockResponse = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};

// A helper function to run the middleware chain
const runValidation = async (req) => {
    const res = mockResponse();
    const next = jest.fn();

    const middlewareChain = validateAdminResetPassword();

    // Run all validation middleware first
    // The first middleware that sends a response will stop the chain.
    for (let i = 0; i < middlewareChain.length - 1; i++) {
        const middleware = middlewareChain[i];
        await new Promise((resolve) => {
            middleware(req, res, () => {
                resolve();
            });
        });
    }

    // Then, run the final error handler middleware
    const finalMiddleware = middlewareChain[middlewareChain.length - 1];
    await finalMiddleware(req, res, next);

    // The next() function is now only called by the final middleware
    // when there are no errors, which matches the expected behavior.

    const validationErrors = res.status.mock.calls.length > 0;
    return {res, next, validationErrors};
};

describe("validateAdminResetPassword", () => {
    test("should pass validation with valid input", async () => {
        const req = mockRequest({
            username: "admin",
            password: "Password123!",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(false);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    // --- Failed Cases ---

    test("should fail if body contains an invalid key", async () => {
        const req = mockRequest({
            username: "admin",
            password: "Password123!",
            invalidKey: "someValue",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: expect.arrayContaining([expect.stringMatching(
                "username, password yang diizinkan.",
            )]),
        });
    });

    test("should fail if username is empty", async () => {
        const req = mockRequest({
            username: "",
            password: "Password123!",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["username cannot be empty."],
        });
    });

    test("should fail if username is not a string", async () => {
        const req = mockRequest({
            username: 123,
            password: "Password123!",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["username type must be string."],
        });
    });

    test("should fail if password is empty", async () => {
        const req = mockRequest({
            username: "admin",
            password: "",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["password cannot be empty."],
        });
    });

    test("should fail if password is not a string", async () => {
        const req = mockRequest({
            username: "admin",
            password: 12345678,
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["password type must be string."],
        });
    });

    test("should fail if password is too short", async () => {
        const req = mockRequest({
            username: "admin",
            password: "P1!",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["Passwordnya kurang panjang anjing!!!"],
        });
    });

    test("should fail if password is too long", async () => {
        const req = mockRequest({
            username: "admin",
            password: "P1!P1!P1!P1!P1!P1!P1!P1!P1!P1!", // 26 characters
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["Yang ini kepanjangan tolol!!!"],
        });
    });

    test("should fail if password does not contain a number", async () => {
        const req = mockRequest({
            username: "admin",
            password: "Password!!",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["password must contain at least one number."],
        });
    });

    test("should fail if password does not contain an uppercase letter",
        async () => {
            const req = mockRequest({
                username: "admin",
                password: "password123!",
            });

            const {res, next, validationErrors} = await runValidation(req);

            expect(validationErrors).toBe(true);
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: ["password must contain at least one uppercase letter."],
            });
        });

    test("should fail if password does not contain a lowercase letter",
        async () => {
            const req = mockRequest({
                username: "admin",
                password: "PASSWORD123!",
            });

            const {res, next, validationErrors} = await runValidation(req);

            expect(validationErrors).toBe(true);
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: ["password must contain at least one lowercase letter."],
            });
        });

    test("should fail if password does not contain a special character",
        async () => {
            const req = mockRequest({
                username: "admin",
                password: "Password123",
            });

            const {res, next, validationErrors} = await runValidation(req);

            expect(validationErrors).toBe(true);
            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.arrayContaining([
                    expect
                        .stringMatching(
                            "one special character",
                        )]),
            });
        });
});

