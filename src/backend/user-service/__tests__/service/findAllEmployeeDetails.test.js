// Impor fungsi yang akan diuji
const {findAllEmployeeDetails} = require("../../src/services/urmService"); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("../../__mocks__/pg.js");
const pool = new Pool();

// Kelompokkan tes untuk fungsi findAllEmployeeDetails
describe("findAllEmployeeDetails", () => {
    // Bersihkan semua mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Berhasil menemukan data pegawai
    it("should return the full database result object when employees are found", async () => {
    // Arrange: Siapkan data palsu seolah-olah dari database
        const mockEmployeeList = [
            {
                employeeId: "peg-001",
                full_name: "Citra Amelia",
                email: "citra.a@example.com",
                department: "Sales",
                position: "Sales Manager",
                is_active: true,
                roles: ["manager", "sales-user"],
            },
            {
                employeeId: "peg-002",
                full_name: "Dodi Firmansyah",
                email: "dodi.f@example.com",
                department: "IT",
                position: "System Administrator",
                is_active: true,
                roles: ["admin", "it-support"],
            },
        ];
        const mockDbResult = {rows: mockEmployeeList, rowCount: 2};
        pool.query.mockResolvedValue(mockDbResult);

        // Act: Panggil fungsi yang diuji
        const result = await findAllEmployeeDetails();

        // Assert: Pastikan hasilnya adalah objek hasil query yang lengkap
        expect(result).toEqual(mockDbResult);
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"));
    });

    // 🧪 Skenario 2: Tidak ada data pegawai
    it("should return a database result with an empty rows array if no employees exist", async () => {
    // Arrange: Siapkan mock dengan array rows yang kosong
        const mockEmptyResult = {rows: [], rowCount: 0};
        pool.query.mockResolvedValue(mockEmptyResult);

        // Act
        const result = await findAllEmployeeDetails();

        // Assert
        expect(result).toEqual(mockEmptyResult);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    // 🧪 Skenario 3: Terjadi error pada database
    it("should throw an error if the database query fails", async () => {
    // Arrange: Atur mock untuk melempar error
        const databaseError = new Error("Query failed");
        pool.query.mockRejectedValue(databaseError);

        // Act & Assert: Verifikasi bahwa fungsi akan melempar error yang sama
        await expect(findAllEmployeeDetails()).rejects.toThrow("Query failed");
    });
});
