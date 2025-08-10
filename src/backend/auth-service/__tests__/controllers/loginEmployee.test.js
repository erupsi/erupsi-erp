const loginEmployee = require("../../src/controllers/loginEmployee");
const passwordUtils = require("../../src/utils/passwordUtils");
const authService = require("../../src/services/authService");
const refreshTokenService = require("../../src/services/RefreshToken");

// Mock semua dependensi yang digunakan
jest.mock("../../src/utils/passwordUtils");
jest.mock("../../src/services/authService");
jest.mock("../../src/services/RefreshToken");

describe("loginEmployee Controller", () => {
    const mockRequest = {
        body: {
            username: "testuser",
            password: "validpassword",
        },
    };
    const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(),
        cookie: jest.fn(() => mockResponse),
    };
    const mockNext = jest.fn();

    // Data mock yang akan digunakan di beberapa test
    const employeeData = {
        employeeid: "emp-123",
        password: "hashedpassword",
        password_expiry: new Date(
            new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
    const urmData = {data: {roles: ["USER"]}};
    const tokens = {refreshToken: "mock-refresh-token",
        accessToken: "mock-access-token"};

    beforeEach(() => {
    // Reset mock-mock sebelum setiap test
        jest.clearAllMocks();
    });

    // --- Skenario Berhasil ---
    test("should return 200 and set cookies for a successful login",
        async () => {
            authService.checkEmployeeByUsername.mockResolvedValue(employeeData);
            passwordUtils.comparator.mockResolvedValue(true);
            authService.getEmployeeDataFromUrm.mockResolvedValue(urmData);
            refreshTokenService.tokenBuilderAssigner.mockResolvedValue(tokens);

            await loginEmployee(mockRequest, mockResponse, mockNext);

            expect(authService.checkEmployeeByUsername)
                .toHaveBeenCalledWith("testuser");
            expect(passwordUtils.comparator)
                .toHaveBeenCalledWith("validpassword", "hashedpassword");
            expect(authService.getEmployeeDataFromUrm)
                .toHaveBeenCalledWith("emp-123");
            expect(refreshTokenService.tokenBuilderAssigner)
                .toHaveBeenCalledWith(
                    mockResponse, "emp-123", "testuser"
                    , ["USER"], {replace_token: true},
                );
            expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Login successful",
                accessToken: "mock-access-token",
            });
        });

    // --- Skenario Password Hampir Kadaluwarsa ---
    test("should return 200 with a password expiry warning", async () => {
        const expiringEmployeeData = {
            ...employeeData,
            password_expiry: new Date(new Date()
                .getTime() + 1 * 25 * 60 * 60 * 1000), // 2 days from now
        };
        authService.checkEmployeeByUsername
            .mockResolvedValue(expiringEmployeeData);
        passwordUtils.comparator.mockResolvedValue(true);
        authService.getEmployeeDataFromUrm.mockResolvedValue(urmData);
        refreshTokenService.tokenBuilderAssigner.mockResolvedValue(tokens);

        await loginEmployee(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Login successful",
            passwordExpiryWarning:
            "Your password will expire in 1 days. Please change it soon.",
        }));
    });

    // --- Skenario Password Sudah Kadaluwarsa ---
    test("should return 200 with a password expired message", async () => {
        const expiredEmployeeData = {
            ...employeeData,
            password_expiry:
              new Date(new Date()
                  .getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        };
        authService.checkEmployeeByUsername
            .mockResolvedValue(expiredEmployeeData);
        passwordUtils.comparator.mockResolvedValue(true);
        authService.getEmployeeDataFromUrm.mockResolvedValue(urmData);
        refreshTokenService.tokenBuilderAssigner.mockResolvedValue(tokens);

        await loginEmployee(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Login successful",
            passwordExpired: "Password expired. Change it now",
        }));
    });

    // --- Skenario Username atau Password Salah ---
    test("should return 401 if username is not found", async () => {
        authService.checkEmployeeByUsername.mockResolvedValue(null);

        await loginEmployee(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({error: "Invalid username or password"});
        expect(passwordUtils.comparator).not.toHaveBeenCalled();
    });

    test("should return 401 if password does not match", async () => {
        authService.checkEmployeeByUsername.mockResolvedValue(employeeData);
        passwordUtils.comparator.mockResolvedValue(false);

        await loginEmployee(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({error: "Invalid username or password"});
        expect(refreshTokenService.tokenBuilderAssigner).not.toHaveBeenCalled();
    });

    // --- Skenario Kesalahan Internal Server ---
    test("should return 500 for an internal server error", async () => {
        authService.checkEmployeeByUsername
            .mockRejectedValue(new Error("Database connection failed"));

        await loginEmployee(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({
                error: "Internal server error At Login Employee"});
    });
});
