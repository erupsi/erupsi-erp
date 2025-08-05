// Import controller yang akan diuji
const deleteEmployee = require("../../src/controllers/deleteEmployee");

// Mock dependensi eksternal (service)
jest.mock("../../src/services/urmService", () => ({
    findEmployeeById: jest.fn(),
    deleteEmployeeBasedOnId: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const {findEmployeeById, deleteEmployeeBasedOnId} = require("../../src/services/urmService");

describe("deleteEmployee Controller", () => {
    let mockRequest;
    let mockResponse;
    const testEmployeeId = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

    beforeEach(() => {
        mockRequest = {
            params: {
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

    test("should delete an employee and return 200 on success", async () => {
    // ARRANGE: Simulasikan pegawai ditemukan dan berhasil dihapus
        findEmployeeById.mockResolvedValue({success: true});
        deleteEmployeeBasedOnId.mockResolvedValue({success: true});

        // ACT: Jalankan controller
        await deleteEmployee(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findEmployeeById).toHaveBeenCalledWith(testEmployeeId);
        expect(deleteEmployeeBasedOnId).toHaveBeenCalledWith(testEmployeeId);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Pegawai berhasil dihapus"});
    });

    // ================= Skenario Gagal =================

    test("should return 404 if employee is not found", async () => {
    // ARRANGE: Simulasikan service tidak menemukan pegawai
        findEmployeeById.mockResolvedValue({success: false});

        // ACT: Jalankan controller
        await deleteEmployee(mockRequest, mockResponse);

        // ASSERT: Pastikan proses hapus tidak dipanggil dan respons 404 dikirim
        expect(findEmployeeById).toHaveBeenCalledWith(testEmployeeId);
        expect(deleteEmployeeBasedOnId).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Pegawai tidak ditemukan."});
    });

    test("should return 400 if employee deletion fails", async () => {
    // ARRANGE: Simulasikan pegawai ditemukan, tetapi proses hapus gagal
        findEmployeeById.mockResolvedValue({success: true});
        deleteEmployeeBasedOnId.mockResolvedValue({success: false});

        // ACT: Jalankan controller
        await deleteEmployee(mockRequest, mockResponse);

        // ASSERT: Periksa respons error
        expect(deleteEmployeeBasedOnId).toHaveBeenCalledWith(testEmployeeId);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Pegawai tidak dapat dihapus"});
    });

    test("should return 500 on internal server error", async () => {
    // ARRANGE: Simulasikan findEmployeeById melempar error tak terduga
        const dbError = new Error("Koneksi database gagal");
        findEmployeeById.mockRejectedValue(dbError);

        // ACT: Jalankan controller
        await deleteEmployee(mockRequest, mockResponse);

        // ASSERT: Pastikan blok catch berjalan benar
        expect(console.error).toHaveBeenCalledWith(dbError);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({error: "Terjadi kesalahan server internal"});
    });
});
