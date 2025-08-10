// Impor fungsi yang akan diuji
const {deleteEmployeeBasedOnId} = require("../../src/services/urmService"); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("../../__mocks__/pg.js");
const pool = new Pool();

// Kelompokkan tes untuk fungsi deleteEmployeeBasedOnId
describe("deleteEmployeeBasedOnId", () => {
    let client;

    // Dapatkan satu instance client sebelum semua tes dijalankan
    beforeAll(async () => {
        client = await pool.connect();
    });

    // Bersihkan mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Hapus data berhasil
    it("should successfully delete an employee and commit the transaction", async () => {
    // Arrange
        const employeeId = "peg-007";
        // Asumsikan semua query (BEGIN, DELETE, COMMIT) berhasil
        client.query.mockResolvedValue();

        // Act
        const result = await deleteEmployeeBasedOnId(employeeId);

        // Assert
        expect(result).toEqual({success: true});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("DELETE FROM employees WHERE employeeId=$1", [employeeId]);
        expect(client.query).toHaveBeenCalledWith("COMMIT");
        expect(client.query).not.toHaveBeenCalledWith("ROLLBACK");
        expect(client.release).toHaveBeenCalledTimes(1);
    });

    // 🧪 Skenario 2: Terjadi error pada database
    it("should rollback the transaction if the database delete fails", async () => {
    // Arrange
        const employeeId = "peg-error";
        const databaseError = new Error("Delete operation failed");

        // Atur mock untuk gagal hanya pada saat query DELETE dijalankan
        client.query.mockImplementation((query) => {
            if (query.startsWith("DELETE")) {
                return Promise.reject(databaseError);
            }
            // Untuk query lain seperti 'BEGIN', biarkan berhasil
            return Promise.resolve();
        });

        // Mata-matai console.error untuk memastikan error dicatat
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // Act
        const result = await deleteEmployeeBasedOnId(employeeId);

        // Assert
        expect(result).toEqual({success: false, message: "Tidak dapat menghapus pegawai"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
        expect(console.error).toHaveBeenCalledWith(databaseError);
        expect(client.release).toHaveBeenCalledTimes(1);

        // Bersihkan spy
        consoleSpy.mockRestore();
    });
});
