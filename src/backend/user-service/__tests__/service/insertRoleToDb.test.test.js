// Impor fungsi yang akan diuji
const {insertRoleToDb} = require("../../src/services/urmService"); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("../../__mocks__/pg.js");
const pool = new Pool();

// Kelompokkan tes untuk fungsi insertRoleToDb
describe("insertRoleToDb", () => {
    let client;

    // Dapatkan satu instance client sebelum semua tes dijalankan
    beforeAll(async () => {
        client = await pool.connect();
    });

    // Bersihkan mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Berhasil menambahkan peran
    it("should successfully insert a new role and commit the transaction", async () => {
    // Arrange
        const newRoleData = ["role-finance-01", "finance", "Finance Staff", "Handles financial data"];
        // Asumsikan semua query (BEGIN, INSERT, COMMIT) berhasil
        client.query.mockResolvedValue();

        // Act
        const result = await insertRoleToDb(...newRoleData);

        // Assert
        expect(result).toEqual({success: true, message: "Roles added successfully"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith(
            "INSERT INTO roles (roleid, name, display_name, description) VALUES ($1, $2, $3, $4)",
            newRoleData,
        );
        expect(client.query).toHaveBeenCalledWith("COMMIT");
        expect(client.query).not.toHaveBeenCalledWith("ROLLBACK");
    });

    // 🧪 Skenario 2: Terjadi error pada database
    it("should rollback the transaction if the database insert fails", async () => {
    // Arrange
        const newRoleData = ["role-fail", "fail", "Fail Role", "This will fail"];
        const databaseError = new Error("Duplicate key value violates unique constraint");

        // Atur mock untuk gagal hanya pada saat query INSERT dijalankan
        client.query.mockImplementation((query) => {
            if (query.startsWith("INSERT")) {
                return Promise.reject(databaseError);
            }
            // Untuk query lain seperti 'BEGIN', biarkan berhasil
            return Promise.resolve();
        });

        // Mata-matai console.error untuk memastikan error dicatat
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // Act
        const result = await insertRoleToDb(...newRoleData);

        // Assert
        expect(result).toEqual({success: false, message: "Failed to add roles"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
        expect(console.error).toHaveBeenCalledWith("Error adding roles details:", databaseError);

        // Bersihkan spy
        consoleSpy.mockRestore();
    });
});
