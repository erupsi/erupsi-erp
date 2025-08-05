// --- File test yang benar dan lengkap ---

const {
    registerUser,
    addEmployeeRequestToUrm,
    checkEmployeeByUsername,
    getEmployeeDataFromUrm,
    getEmployeeUsername,
    changeEmployeePassword,
} = require("../../src/services/authService");

// Mock semua dependensi yang digunakan
const pool = require("../../src/services/db");
const {bcryptSalting} = require("../../src/utils/passwordUtils");
const requestBuilder = require("../../src/utils/requestBuilder");

jest.mock("../../src/services/db");
jest.mock("../../src/utils/passwordUtils");
jest.mock("../../src/utils/requestBuilder");

// Karena registerUser memanggil checkEmployeeByUsername secara internal
// dan kita tidak bisa mem-mock panggilan internal, kita harus
// mem-mock pool.query untuk kedua fungsi tersebut.

describe("Auth Service Functions", () => {
    beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
        jest.clearAllMocks();
    });

    // --- Test suite for registerUser ---
    describe("registerUser", () => {
    // Ini adalah cara baru untuk menguji registerUser
    // Kita mock pool.query, bukan checkEmployeeByUsername
        test("should return success: true on successful registration",
            async () => {
                pool.query
                    .mockResolvedValueOnce({rows: []})
                    .mockResolvedValueOnce({}); // Panggilan kedua dari INSERT
                bcryptSalting.mockResolvedValue("hashed_password");

                const result =
                await registerUser("mock-uuid",
                    "testuser", "password123", new Date());

                expect(pool.query).toHaveBeenCalledTimes(2);
                expect(pool.query)
                    .toHaveBeenCalledWith(
                        "SELECT * FROM auth_employee WHERE username=$1",
                        ["testuser"],
                    );
                expect(bcryptSalting).toHaveBeenCalledWith("password123");
                expect(result).toEqual({success: true});
            });

        test("should return success: false if username already exists",
            async () => {
            // Skenario: checkEmployeeByUsername menemukan user
                pool.query.mockResolvedValue({rows: [{username: "testuser"}]});

                const result = await registerUser("mock-uuid",
                    "testuser", "password123", new Date());

                expect(pool.query).toHaveBeenCalledTimes(1);
                expect(bcryptSalting).not.toHaveBeenCalled();
                expect(result).toEqual({success: false,
                    message: "User Already Defined"});
            });

        test("should return success: false on a database error", async () => {
            pool.query
                .mockResolvedValueOnce({rows: []})
                .mockRejectedValue(new Error("DB connection failed"));
            bcryptSalting.mockResolvedValue("hashed_password");

            const result = await registerUser("mock-uuid",
                "testuser", "password123", new Date());

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(result).toEqual({success: false});
        });
    });

    // --- Test suite for checkEmployeeByUsername ---
    describe("checkEmployeeByUsername", () => {
        test("should return employee data if user is found", async () => {
            const mockResult = {rows: [{
                employeeId: "id-123", username: "testuser"}]};
            pool.query.mockResolvedValue(mockResult);

            const result = await checkEmployeeByUsername("testuser");

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM auth_employee WHERE username=$1", ["testuser"]);
            expect(result).toEqual(mockResult.rows[0]);
        });

        test("should return undefined if user is not found", async () => {
            pool.query.mockResolvedValue({rows: []});

            const result = await checkEmployeeByUsername("nonexistent");

            expect(result).toBeUndefined();
        });

        test("should return false on a database error", async () => {
            pool.query.mockRejectedValue(new Error("DB connection failed"));

            const result = await checkEmployeeByUsername("testuser");

            expect(result).toBe(false);
        });
    });

    // --- Test suite for AddEmployeeRequestToUrm ---
    describe("addEmployeeRequestToUrm", () => {
        const validData = {
            employeeId: "id-123",
            fullName: "John Doe",
            email: "john@example.com",
            department: "IT",
            position: "Developer",
            roleName: "user",
        };

        test("should return a success response from URM", async () => {
            requestBuilder.mockResolvedValue({
                success: true, data: {employeeId: "id-123"}});

            const result = await addEmployeeRequestToUrm(
                validData.employeeId,
                validData.fullName,
                validData.email,
                validData.department,
                validData.position,
                validData.roleName,
            );

            expect(requestBuilder).toHaveBeenCalledWith(
                "http://localhost:3001/urm/employee",
                "POST",
                validData,
            );
            expect(result).toEqual({
                success: true, data: {employeeId: "id-123"}});
        });

        test("should throw an error if URM returns a failure", async () => {
            requestBuilder.mockResolvedValue({success: false, status: 400});

            await expect(
                addEmployeeRequestToUrm(
                    validData.employeeId,
                    validData.fullName,
                    validData.email,
                    validData.department,
                    validData.position,
                    validData.roleName,
                ),
            ).rejects.toThrow("HTTP error! status: 400");
        });

        test("should throw an error if a required field is missing",
            async () => {
                await expect(
                    addEmployeeRequestToUrm(
                        validData.employeeId,
                        validData.fullName,
                        validData.email,
                        validData.department,
                        validData.position,
                        null,
                    ),
                ).rejects.toThrow("Employee data is less than required");
            });
    });

    // --- Test suite for getEmployeeDataFromUrm ---
    describe("getEmployeeDataFromUrm", () => {
        test("should return employee data from URM", async () => {
            const mockUrmResponse = {data: {name: "John Doe"}};
            requestBuilder.mockResolvedValue(mockUrmResponse);

            const result = await getEmployeeDataFromUrm("id-123");

            expect(requestBuilder).toHaveBeenCalledWith(
                "http://localhost:3001/urm/employee/id-123",
                "GET",
            );
            expect(result).toEqual(mockUrmResponse);
        });
    });

    // --- Test suite for getEmployeeUsername ---
    describe("getEmployeeUsername", () => {
        test("should return the username for a given employeeId", async () => {
            const mockResult = {rows: [{username: "testuser"}]};
            pool.query.mockResolvedValue(mockResult);

            const result = await getEmployeeUsername("id-123");

            expect(pool.query).toHaveBeenCalledWith(
                "SELECT username FROM auth_employee WHERE employeeId=$1",
                ["id-123"]);
            expect(result).toBe("testuser");
        });

        test("should return false on a database error", async () => {
            pool.query.mockRejectedValue(new Error("DB connection failed"));

            const result = await getEmployeeUsername("id-123");

            expect(result).toBe(false);
        });
    });

    // --- Test suite for changeEmployeePassword ---
    describe("changeEmployeePassword", () => {
        test("should return success: true on a successful password change",
            async () => {
                pool.query.mockResolvedValue({});

                const result = await changeEmployeePassword(
                    "testuser", "new_hashed_password", new Date());

                expect(pool.query).toHaveBeenCalledTimes(1);
                expect(result).toEqual({success: true});
            });

        test("should return success: false on a database error", async () => {
            pool.query.mockRejectedValue(new Error("DB connection failed"));

            const result = await changeEmployeePassword(
                "testuser", "new_hashed_password", new Date());

            expect(result).toEqual({success: false});
        });
    });
});
