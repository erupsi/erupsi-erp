// Import controller yang akan diuji
const getAllEmployee = require("../../src/controllers/getAllEmployee");

// Mock dependensi eksternal (service)
jest.mock("../../src/services/urmService", () => ({
    findAllEmployeeDetails: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const {findAllEmployeeDetails} = require("../../src/services/urmService");

describe("getAllEmployee Controller", () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
    // Request tidak membawa data, jadi bisa objek kosong
        mockRequest = {};
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

    test("should return a list of employees and status 200 if employees are found", async () => {
    // ARRANGE: Simulasikan service mengembalikan data pegawai
        const mockEmployees = [
            {id: "1", fullName: "Budi"},
            {id: "2", fullName: "Siti"},
        ];
        findAllEmployeeDetails.mockResolvedValue({rows: mockEmployees});

        // ACT: Jalankan controller
        await getAllEmployee(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findAllEmployeeDetails).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true, data: mockEmployees});
    });

    // ================= Skenario Gagal / Kasus Khusus =================

    test("should return 404 if no employees are found", async () => {
    // ARRANGE: Simulasikan service tidak menemukan data (array rows kosong)
        findAllEmployeeDetails.mockResolvedValue({rows: []});

        // ACT: Jalankan controller
        await getAllEmployee(mockRequest, mockResponse);

        // ASSERT: Periksa respons 404
        expect(findAllEmployeeDetails).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({success: false, message: "No employees found."});
    });

    test("should return 500 on internal server error", async () => {
    // ARRANGE: Simulasikan service melempar error tak terduga
        const dbError = new Error("Gagal menjalankan query");
        findAllEmployeeDetails.mockRejectedValue(dbError);

        // ACT: Jalankan controller
        await getAllEmployee(mockRequest, mockResponse);

        // ASSERT: Pastikan blok catch berjalan benar
        expect(console.error).toHaveBeenCalledWith("Error retrieving employees:", dbError);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
            error: dbError.message,
        });
    });
});
