// Import controller yang akan diuji
const assignRoleToEmployee = require("../../src/controllers/assignRoleToEmployee"); // Sesuaikan path jika perlu

// Mengimpor dependensi untuk di-mock
const {findEmployeeById, insertRolesToEmployee} = require("../../src/services/urmService");
const validator = require("validator");

// Mock dependensi secara otomatis oleh Jest
jest.mock("../../src/services/urmService");
jest.mock("validator");

describe("assignRoleToEmployee Controller", () => {
    let mockReq;
    let mockRes;

    // Fungsi ini dijalankan sebelum setiap test
    beforeEach(() => {
        // Reset semua mock sebelum setiap test untuk memastikan isolasi
        jest.clearAllMocks();

        // Membuat objek request (req) mock
        mockReq = {
            params: {
                employeeId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            },
            body: ["role-id-1", "role-id-2"],
        };

        // Membuat objek response (res) mock dengan fungsi jest
        mockRes = {
            status: jest.fn().mockReturnThis(), // .status() mengembalikan "this" (objek res) untuk chaining
            json: jest.fn(),
        };
    });

    // Test 1: Skenario Sukses ✅
    it("should assign roles and return 200 on success", async () => {
        // Arrange: Menyiapkan kondisi untuk test
        validator.isUUID.mockReturnValue(true);
        findEmployeeById.mockResolvedValue({success: true, data: {id: mockReq.params.employeeId}});
        insertRolesToEmployee.mockResolvedValue({success: true});

        // Act: Menjalankan fungsi yang di-test
        await assignRoleToEmployee(mockReq, mockRes);

        // Assert: Memverifikasi hasil
        expect(validator.isUUID).toHaveBeenCalledWith(mockReq.params.employeeId);
        expect(findEmployeeById).toHaveBeenCalledWith(mockReq.params.employeeId);
        expect(insertRolesToEmployee).toHaveBeenCalledWith(mockReq.params.employeeId, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({success: "Role pegawai berhasil diubah"});
    });

    // Test 2: ID Pegawai Tidak Valid ❌
    it("should return 400 if employeeId is not a valid UUID", async () => {
        // Arrange
        mockReq.params.employeeId = "not-a-uuid";
        validator.isUUID.mockReturnValue(false);

        // Act
        await assignRoleToEmployee(mockReq, mockRes);

        // Assert
        expect(validator.isUUID).toHaveBeenCalledWith("not-a-uuid");
        expect(findEmployeeById).not.toHaveBeenCalled(); // Fungsi ini tidak boleh dipanggil
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Invalid employee ID format"});
    });

    it("should return 404 if employee is not found", async () => {
        // Arrange
        validator.isUUID.mockReturnValue(true);
        findEmployeeById.mockResolvedValue({success: false}); // Simulasi pegawai tidak ditemukan

        // Act
        await assignRoleToEmployee(mockReq, mockRes);

        // Assert
        expect(findEmployeeById).toHaveBeenCalledWith(mockReq.params.employeeId);
        expect(insertRolesToEmployee).not.toHaveBeenCalled(); // Fungsi ini tidak boleh dipanggil
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: "Pegawai tidak ditemukan."});
    });

    it("should return 400 if inserting roles fails", async () => {
        // Arrange
        validator.isUUID.mockReturnValue(true);
        findEmployeeById.mockResolvedValue({success: true});
        insertRolesToEmployee.mockResolvedValue({success: false, message: "Gagal menyisipkan peran"});

        // Act
        await assignRoleToEmployee(mockReq, mockRes);

        // Assert
        expect(insertRolesToEmployee).toHaveBeenCalledWith(mockReq.params.employeeId, mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Gagal menyisipkan peran"});
    });

    // Test 5: Kesalahan Server Internal 💥
    it("should return 500 on an internal server error", async () => {
        // Arrange
        validator.isUUID.mockReturnValue(true);
        const errorMessage = "Database connection lost";
        findEmployeeById.mockRejectedValue(new Error(errorMessage)); // Simulasi error tak terduga

        // Menyembunyikan console.error selama test ini agar output test tetap bersih
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // Act
        await assignRoleToEmployee(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({error: "Terjadi kesalahan server internal"});
        expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error)); // Memastikan error dicatat

        // Mengembalikan fungsi console.error ke kondisi semula
        consoleErrorSpy.mockRestore();
    });
});
