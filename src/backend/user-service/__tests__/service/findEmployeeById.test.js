// Impor fungsi yang akan diuji
const {findEmployeeById} = require("../../src/services/urmService"); // Sesuaikan path jika perlu

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("pg");
const pool = new Pool();

// Kelompokkan tes untuk fungsi findEmployeeById
describe("findEmployeeById", () => {
    // Bersihkan semua mock setelah setiap tes untuk memastikan isolasi
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Pegawai ditemukan
    it("should return { success: true } when an employee is found", async () => {
    // Arrange: Siapkan data palsu seolah-olah query berhasil menemukan satu pegawai
        const employeeId = "peg-001";
        const mockDbResult = {rows: [{employeeId: "peg-001", full_name: "Budi"}]};
        pool.query.mockResolvedValue(mockDbResult);

        // Act: Panggil fungsi yang diuji
        const result = await findEmployeeById(employeeId);

        // Assert: Pastikan hasilnya sesuai harapan
        expect(result).toEqual({success: true});
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM employees WHERE employeeId = $1", [employeeId]);
    });

    // 🧪 Skenario 2: Pegawai tidak ditemukan
    it("should return { success: false, message: ... } when an employee is not found", async () => {
    // Arrange: Siapkan data palsu seolah-olah query tidak menemukan apa pun
        const employeeId = "peg-999";
        const mockDbResult = {rows: []}; // Array kosong menandakan tidak ada data
        pool.query.mockResolvedValue(mockDbResult);

        // Act: Panggil fungsi yang diuji
        const result = await findEmployeeById(employeeId);

        // Assert: Pastikan hasilnya sesuai dengan pesan kegagalan
        expect(result).toEqual({success: false, message: "pegawai tidak ditemukan."});
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM employees WHERE employeeId = $1", [employeeId]);
    });

    // 🧪 Skenario 3: Terjadi error database
    it("should throw an error if the database query fails", async () => {
    // Arrange: Atur agar mock melempar sebuah error
        const employeeId = "peg-error";
        const databaseError = new Error("Koneksi database gagal");
        pool.query.mockRejectedValue(databaseError);

        // Act & Assert: Verifikasi bahwa fungsi akan melempar error yang sama
        // `rejects.toThrow()` adalah cara Jest untuk menangani error pada fungsi async
        await expect(findEmployeeById(employeeId)).rejects.toThrow("Koneksi database gagal");
    });
});
