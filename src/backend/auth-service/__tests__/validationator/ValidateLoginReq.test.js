const validateLoginReq =
require("../../src/validationator/validateLoginReq");
// const {body} = require("express-validator");

// Mock request and response objects for testing
const mockRequest = (body) => ({body});
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

    const middlewareChain = validateLoginReq();

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
    return {res, next, validationErrors};
};

describe("validateLoginReq", () => {
    test("should pass validation with valid input", async () => {
        const req = mockRequest({
            username: "testuser",
            password: "testpassword123",
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
            username: "testuser",
            password: "testpassword123",
            invalidKey: "someValue",
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: [expect.stringMatching(
                "Hanya username, password yang diizinkan."),
            ]});
    });

    test("should fail if username is empty", async () => {
        const req = mockRequest({
            username: "",
            password: "testpassword123",
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
            username: 12345,
            password: "testpassword123",
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
            username: "testuser",
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
            username: "testuser",
            password: 12345,
        });

        const {res, next, validationErrors} = await runValidation(req);

        expect(validationErrors).toBe(true);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: ["password type must be string."],
        });
    });
});
