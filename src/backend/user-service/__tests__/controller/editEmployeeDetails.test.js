// Import controller yang akan diuji
const editEmployeeDetails = require("../../src/controllers/editEmployeeDetails");

// Mock dependensi eksternal (service)
jest.mock("../../src/services/urmService", () => ({
    findEmployeeById: jest.fn(),
    updateEmployeePartially: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const {findEmployeeById, updateEmployeePartially} = require("../../src/services/urmService");

describe("editEmployeeDetails Controller", () => {
    let mockRequest;
    let mockResponse;
    const testEmployeeId = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

    beforeEach(() => {
        mockRequest = {
            params: {
                employeeId: testEmployeeId,
            },
            body: {
                position: "Senior Engineer",
                department: "IT",
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

    test("should update employee details and return 200 on success", async () => {
    // ARRANGE: Simulasikan pegawai ditemukan dan update berhasil
        findEmployeeById.mockResolvedValue({success: true});
        updateEmployeePartially.mockResolvedValue({success: true});

        // ACT: Jalankan controller
        await editEmployeeDetails(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findEmployeeById).toHaveBeenCalledWith(testEmployeeId);
        expect(updateEmployeePartially).toHaveBeenCalledWith(
            testEmployeeId,
            mockRequest.body,
            ["full_name", "email", "department", "position", "is_active"],
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Data Pegawai berhasil diupdate"});
    });

    // ================= Skenario Gagal =================

    test("should return 404 if employee is not found", async () => {
    // ARRANGE: Simulasikan service tidak menemukan pegawai
        findEmployeeById.mockResolvedValue({success: false});

        // ACT: Jalankan controller
        await editEmployeeDetails(mockRequest, mockResponse);

        // ASSERT: Pastikan proses update tidak dipanggil dan respons 404 dikirim
        expect(findEmployeeById).toHaveBeenCalledWith(testEmployeeId);
        expect(updateEmployeePartially).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Pegawai tidak ditemukan."});
    });

    test("should return 400 if update service fails", async () => {
    // ARRANGE: Simulasikan pegawai ditemukan, tetapi proses update gagal
        findEmployeeById.mockResolvedValue({success: true});
        updateEmployeePartially.mockResolvedValue({success: false});

        // ACT: Jalankan controller
        await editEmployeeDetails(mockRequest, mockResponse);

        // ASSERT: Periksa respons error dari service
        expect(updateEmployeePartially).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json)
            .toHaveBeenCalledWith({
                message: "Tidak ada properti yang valid untuk diupdate atau pegawai tidak ditemukan.",
            });
    });

    test("should return 500 on internal server error", async () => {
    // ARRANGE: Simulasikan findEmployeeById melempar error tak terduga
        const dbError = new Error("Transaksi database gagal");
        findEmployeeById.mockRejectedValue(dbError);

        // ACT: Jalankan controller
        await editEmployeeDetails(mockRequest, mockResponse);

        // ASSERT: Pastikan blok catch berjalan benar
        expect(console.error).toHaveBeenCalledWith("Error updating user in PostgreSQL:", dbError);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Kesalahan server internal."});
    });
});
