// Import controller yang akan diuji
const getEmployeeDetail = require("../../src/controllers/getEmployeeDetail");

// Mock dependensi eksternal (service)
jest.mock("../../src/services/urmService", () => ({
    findEmployeeDetailByEmployeeId: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const {findEmployeeDetailByEmployeeId} = require("../../src/services/urmService");

describe("getEmployeeDetail Controller", () => {
    let mockRequest;
    let mockResponse;
    const testEmployeeId = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

    beforeEach(() => {
        // PERBAIKAN 1: Menggunakan req.body, bukan req.params
        mockRequest = {
            body: {
                employeeId: testEmployeeId,
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mengatur console.error agar tidak menampilkan log saat tes sengaja dibuat gagal
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ================= Skenario Sukses =================

    test("should return employee details and status 200 if employee is found", async () => {
        const mockEmployeeDetail = {
            id: testEmployeeId,
            fullName: "Budi Santoso",
            email: "budi.s@example.com",
        };
        findEmployeeDetailByEmployeeId.mockResolvedValue(mockEmployeeDetail);

        await getEmployeeDetail(mockRequest, mockResponse);

        expect(findEmployeeDetailByEmployeeId).toHaveBeenCalledWith(testEmployeeId);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true, data: mockEmployeeDetail});
    });

    // ================= Skenario Gagal / Kasus Khusus =================

    test("should return 404 if no employee is found", async () => {
        findEmployeeDetailByEmployeeId.mockResolvedValue(null);

        await getEmployeeDetail(mockRequest, mockResponse);

        expect(findEmployeeDetailByEmployeeId).toHaveBeenCalledWith(testEmployeeId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({success: false, message: "Employee not found."});
    });

    test("should return 500 on internal server error", async () => {
        const dbError = new Error("Gagal menjalankan query detail");
        findEmployeeDetailByEmployeeId.mockRejectedValue(dbError);

        await getEmployeeDetail(mockRequest, mockResponse);

        // PERBAIKAN 2: Menyesuaikan pesan error log agar cocok dengan implementasi
        expect(console.error).toHaveBeenCalledWith("Error in POST /employee/get-employee:", dbError);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
            error: dbError.message,
        });
    });
});
