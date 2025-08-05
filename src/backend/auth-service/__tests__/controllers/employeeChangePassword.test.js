const employeeChangePassword =
  require("../../src/controllers/employeeChangePassword");
const jwt = require("jsonwebtoken");
const authService = require("../../src/services/authService");
const passwordUtils = require("../../src/utils/passwordUtils");

// Mock semua dependensi yang digunakan
jest.mock("jsonwebtoken");
jest.mock("../../src/services/authService");
jest.mock("../../src/utils/passwordUtils");

describe("employeeChangePassword Controller", () => {
    const mockRequest = (oldPass, newPass, token = "mock-token") => ({
        body: {
            oldPassword: oldPass,
            newPassword: newPass,
        },
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    const mockResponse = {
        status: jest.fn(() => mockResponse),
        json: jest.fn(),
    };

    const mockNext = jest.fn();

    // Data mock yang akan digunakan di beberapa test
    const employeeData = {
        username: "testuser",
        password: "hashedOldPassword",
    };
    const decodedToken = {username: "testuser"};

    beforeEach(() => {
    // Reset mock-mock sebelum setiap test
        jest.clearAllMocks();
    });

    // --- Skenario Berhasil ---
    test("should successfully change password and return 200", async () => {
        jwt.verify.mockReturnValue(decodedToken);
        authService.checkEmployeeByUsername.mockResolvedValue(employeeData);
        passwordUtils
            .comparator
            .mockResolvedValueOnce(true).mockResolvedValueOnce(false);
        passwordUtils.bcryptSalting.mockResolvedValue("hashedNewPassword");
        authService.changeEmployeePassword.mockResolvedValue({success: true});

        await employeeChangePassword(mockRequest("oldPass", "newPass"),
            mockResponse, mockNext);

        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(authService.checkEmployeeByUsername)
            .toHaveBeenCalledWith("testuser");
        expect(passwordUtils.comparator)
            .toHaveBeenCalledWith("oldPass", "hashedOldPassword");
        expect(passwordUtils.comparator)
            .toHaveBeenCalledWith("newPass", "hashedOldPassword");
        expect(passwordUtils.bcryptSalting).toHaveBeenCalledWith("newPass");
        expect(authService.changeEmployeePassword).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json)
            .toHaveBeenCalledWith(
                {message: "Your password changed successfully"});
    });

    // --- Skenario Gagal: Password Lama Tidak Cocok ---
    test("should return 401 if old password does not match", async () => {
        jwt.verify.mockReturnValue(decodedToken);
        authService.checkEmployeeByUsername.mockResolvedValue(employeeData);
        passwordUtils.comparator.mockResolvedValue(false);

        await employeeChangePassword(mockRequest("wrongOldPass", "newPass"),
            mockResponse, mockNext);

        expect(passwordUtils.comparator).toHaveBeenCalledWith("wrongOldPass",
            "hashedOldPassword");
        expect(authService.changeEmployeePassword).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({
                error: "Password doesn't match it's predecessor"});
    });

    // --- Skenario Gagal: Password Baru Sama dengan yang Lama ---
    test("should return 401 if new password is the same as the old one",
        async () => {
            jwt.verify.mockReturnValue(decodedToken);
            authService.checkEmployeeByUsername.mockResolvedValue(employeeData);
            passwordUtils
                .comparator.mockResolvedValueOnce(true)
                .mockResolvedValueOnce(true);

            await employeeChangePassword(mockRequest("oldPass", "oldPass"),
                mockResponse, mockNext);

            expect(passwordUtils.comparator)
                .toHaveBeenCalledWith("oldPass", "hashedOldPassword");
            expect(authService.changeEmployeePassword).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json)
                .toHaveBeenCalledWith({
                    error: "You dumbfuck didn't change anything"});
        });

    // --- Skenario Gagal: Token Tidak Valid ---
    test("should return 500 for an invalid token", async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid signature");
        });

        await employeeChangePassword(
            mockRequest("oldPass", "newPass", "invalid-token"),
            mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({error: "Internal server error"});
        expect(authService.checkEmployeeByUsername).not.toHaveBeenCalled();
    });

    // --- Skenario Gagal: Token Tanpa username ---
    test("should return 401 if token has no username", async () => {
        jwt.verify.mockReturnValue({}); // Decoded token tanpa username

        await employeeChangePassword(mockRequest("oldPass", "newPass"),
            mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "You are not authorized to send this request."});
        expect(authService.checkEmployeeByUsername).not.toHaveBeenCalled();
    });

    // --- Skenario Gagal: Memperbarui Password Gagal ---
    test("should return 500 if password change fails in the service layer",
        async () => {
            jwt.verify.mockReturnValue(decodedToken);
            authService.checkEmployeeByUsername.mockResolvedValue(employeeData);
            passwordUtils.comparator
                .mockResolvedValueOnce(true).mockResolvedValueOnce(false);
            passwordUtils.bcryptSalting.mockResolvedValue("hashedNewPassword");
            authService.changeEmployeePassword
                .mockResolvedValue({success: false});

            await employeeChangePassword(mockRequest("oldPass", "newPass"),
                mockResponse, mockNext);

            expect(authService.changeEmployeePassword).toHaveBeenCalledTimes(1);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error:
                    expect.stringMatching(
                        " Password change attempt unsuccessful",
                    ),
            });
        });

    // --- Skenario Gagal: Internal Server Error (Lainnya) ---
    test("should return 500 for any other internal server error", async () => {
        authService.checkEmployeeByUsername.mockRejectedValue(new Error(
            "Database connection failed"));

        await employeeChangePassword(mockRequest("oldPass", "newPass"),
            mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({error: "Internal server error"});
    });
});
