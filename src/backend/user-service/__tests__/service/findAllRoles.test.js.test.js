// Impor fungsi yang akan diuji
const {findAllRoles} = require("../../src/services/urmService"); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("pg");
const pool = new Pool();

// Kelompokkan tes untuk fungsi findAllRoles
describe("findAllRoles", () => {
    // Bersihkan semua mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Berhasil menemukan data peran
    it("should return an array of role objects when roles are found", async () => {
    // Arrange: Siapkan data palsu seolah-olah dari database
        const mockRolesList = [
            {
                roleid: "role-01",
                name: "admin",
                display_name: "Administrator",
                description: "Akses penuh ke sistem.",
            },
            {
                roleid: "role-02",
                name: "viewer",
                display_name: "Viewer",
                description: "Hanya bisa melihat data.",
            },
        ];
        // Fungsi mengembalikan result.rows, jadi kita mock objek result lengkap
        const mockDbResult = {rows: mockRolesList};
        pool.query.mockResolvedValue(mockDbResult);

        // Act: Panggil fungsi yang diuji
        const roles = await findAllRoles();

        // Assert: Pastikan hasilnya adalah array dari mock, bukan objek result lengkap
        expect(roles).toEqual(mockRolesList);
        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"));
    });

    // 🧪 Skenario 2: Tidak ada data peran
    it("should return an empty array if no roles exist in the database", async () => {
    // Arrange: Siapkan mock dengan array rows yang kosong
        const mockEmptyResult = {rows: []};
        pool.query.mockResolvedValue(mockEmptyResult);

        // Act
        const roles = await findAllRoles();

        // Assert
        expect(roles).toEqual([]); // Hasilnya harus array kosong
        expect(pool.query).toHaveBeenCalledTimes(1);
    });

    // 🧪 Skenario 3: Terjadi error pada database
    it("should throw an error if the database query fails", async () => {
    // Arrange: Atur mock untuk melempar error
        const databaseError = new Error("Connection timeout");
        pool.query.mockRejectedValue(databaseError);

        // Act & Assert: Verifikasi bahwa fungsi akan melempar error yang sama
        await expect(findAllRoles()).rejects.toThrow("Connection timeout");
    });
});
