const {csrfHandler,
    handlerErrorCsrf} =
    require("../../src/middlewares/csrfProtect"); // Sesuaikan path jika perlu
// const csrf = require("csurf");

// Mock request and response objects for testing
const mockRequest = (token = "mock-token", cookieToken = "mock-token") => ({
    csrfToken: () => token,
    cookies: {
        _csrf: cookieToken,
    },
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};

// Mock `next` function
const mockNext = jest.fn();

describe("CSRF Middleware and Handlers", () => {
    describe("csrfHandler", () => {
        test("should respond with a new CSRF token", async () => {
            const req = mockRequest();
            const res = mockResponse();

            await csrfHandler(req, res);

            // Memastikan res.json dipanggil dengan objek yang berisi csrfToken
            expect(res.json).toHaveBeenCalledWith({csrfToken: "mock-token"});
        });
    });

    describe("handlerErrorCsrf", () => {
        test(`should return 403 Forbidden with
              a custom error message for EBADCSRFTOKEN`,
        async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = {code: "EBADCSRFTOKEN"};
            await handlerErrorCsrf(error, req, res, mockNext);
            // Memastikan status 403 dipanggil
            expect(res.status).toHaveBeenCalledWith(403);
            // Memastikan respons JSON berisi pesan error yang benar
            expect(res.json).toHaveBeenCalledWith({
                error: "Token CSRF tidak valid. Permintaan diblokir."});
            // Memastikan `next` tidak dipanggil
            expect(mockNext).not.toHaveBeenCalled();
        });

        test("should call next() for non-CSRF errors", async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error("Some other error");

            await handlerErrorCsrf(error, req, res, mockNext);

            // Memastikan `next` dipanggil dengan error
            expect(mockNext).toHaveBeenCalledWith(error);
            // Memastikan status dan json tidak dipanggil
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });
});
