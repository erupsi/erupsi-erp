// Impor fungsi yang akan diuji
const {updateEmployeePartially} = require("../../src/services/urmService"); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("../../__mocks__/pg.js");
const pool = new Pool();

// Kelompokkan tes untuk fungsi updateEmployeePartially
describe("updateEmployeePartially", () => {
    let client;

    // Dapatkan satu instance client sebelum semua tes dijalankan
    beforeAll(async () => {
        client = await pool.connect();
    });

    // Bersihkan mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Update berhasil
    it("should successfully update employee data and commit the transaction", async () => {
    // Arrange
        const employeeId = "peg-001";
        const updates = {position: "Senior Developer", department: "Technology"};
        const allowedFields = ["position", "department", "full_name"];

        // Asumsikan semua query berhasil
        client.query.mockResolvedValue({rowCount: 1});

        // Act
        const result = await updateEmployeePartially(employeeId, updates, allowedFields);

        // Assert
        expect(result).toEqual({success: true, message: "Data pegawai berhasil diupdate"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");

        // Verifikasi query UPDATE yang dinamis
        expect(client.query).toHaveBeenCalledWith(
            expect.stringMatching(/UPDATE\s+employees\s+SET\s+position\s*=\s*\$1,\s*department\s*=\s*\$2*/),
            ["Senior Developer", "Technology", employeeId],
        );

        expect(client.query).toHaveBeenCalledWith("COMMIT");
        expect(client.query).not.toHaveBeenCalledWith("ROLLBACK");
        expect(client.release).toHaveBeenCalledTimes(1);
    });

    // 🧪 Skenario 2: Tidak ada field yang valid untuk diupdate
    it("should throw an error if no valid fields are provided", async () => {
    // Arrange
        const employeeId = "peg-002";
        const updates = {age: 30, city: "Jakarta"}; // Field tidak diizinkan
        const allowedFields = ["position", "department"];

        // Act & Assert
        // Pastikan fungsi melempar error yang spesifik dan tidak menyentuh database
        await expect(updateEmployeePartially(employeeId, updates, allowedFields))
            .rejects
            .toThrow("Tidak ada properti yang valid untuk diupdate.");

        // Pastikan tidak ada interaksi database sama sekali
        expect(client.query).not.toHaveBeenCalled();
        expect(client.release).not.toHaveBeenCalled();
    });

    // 🧪 Skenario 3: Terjadi error pada database
    it("should rollback the transaction if the database update fails", async () => {
    // Arrange
        const employeeId = "peg-003";
        const updates = {position: "Lead Developer"};
        const allowedFields = ["position"];
        const databaseError = new Error("Database connection error");

        // Atur mock untuk gagal hanya pada query UPDATE
        client.query.mockImplementation((query) => {
            if (query.trim().startsWith("UPDATE")) {
                // Lemparkan error untuk query UPDATE
                return Promise.reject(databaseError);
            }
            // Untuk query lain seperti 'BEGIN', biarkan berhasil.
            return Promise.resolve();
        });

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // Act
        const result = await updateEmployeePartially(employeeId, updates, allowedFields);


        // Assert
        expect(result).toEqual({success: false, message: "Data pegawai gagal diupdate"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
        expect(client.release).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith("Error in updatePartialUser service:", databaseError);

        consoleSpy.mockRestore();
    });
});
