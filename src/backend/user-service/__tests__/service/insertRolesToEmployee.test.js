// Impor fungsi yang akan diuji
const {insertRolesToEmployee} = require("../../src/services/urmService"); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock("pg");
const {Pool} = require("../../__mocks__/pg.js");
const pool = new Pool();

// Kelompokkan tes untuk fungsi insertRolesToEmployee
describe("insertRolesToEmployee", () => {
    let client;

    // Dapatkan satu instance client sebelum semua tes dijalankan
    beforeAll(async () => {
        client = await pool.connect();
    });

    // Bersihkan mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Skenario 1: Berhasil mengubah roles
    it("should successfully assign new roles to an employee", async () => {
    // Arrange
        const employeeId = "peg-001";
        const rolesPayload = {roles: ["admin", "editor"]};
        // Simulasikan DB menemukan semua role yang diminta
        const mockRolesFromDb = [
            {roleid: "role-01", name: "admin"},
            {roleid: "role-02", name: "editor"},
        ];

        client.query.mockImplementation((query) => {
            if (query.includes("SELECT roleid, name FROM roles")) {
                return Promise.resolve({rows: mockRolesFromDb});
            }
            return Promise.resolve(); // Untuk BEGIN, DELETE, INSERT, COMMIT
        });

        // Act
        const result = await insertRolesToEmployee(employeeId, rolesPayload);

        // Assert
        expect(result).toEqual({success: true, message: "Roles pegawai berhasil diubah."});
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("DELETE FROM employee_roles WHERE employee_id = $1", [employeeId]);
        expect(client.query)
            .toHaveBeenCalledWith(expect
                .stringContaining("INSERT INTO employee_roles"), [employeeId, "role-01", "role-02"]);
        expect(client.query).toHaveBeenCalledWith("COMMIT");
        expect(client.release).toHaveBeenCalledTimes(1);
    });

    // 🧪 Skenario 2: Berhasil menghapus semua role
    it("should clear all roles if an empty roles array is provided", async () => {
    // Arrange
        const employeeId = "peg-002";
        const rolesPayload = {roles: []};
        client.query.mockResolvedValue();

        // Act
        const result = await insertRolesToEmployee(employeeId, rolesPayload);

        // Assert
        expect(result).toEqual({success: true, message: "Roles pegawai berhasil diubah."});
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("DELETE FROM employee_roles WHERE employee_id = $1", [employeeId]);
        // Pastikan tidak ada query INSERT yang dipanggil
        expect(client.query).not.toHaveBeenCalledWith(expect.stringContaining("INSERT INTO employee_roles"));
        expect(client.query).toHaveBeenCalledWith("COMMIT");
    });

    // 🧪 Skenario 3: Gagal karena input 'roles' tidak valid
    it("should rollback and return failure if payload is not a valid array", async () => {
    // Arrange
        const employeeId = "peg-003";
        const invalidPayload = {roles: "bukan-array"};

        // Act
        const result = await insertRolesToEmployee(employeeId, invalidPayload);

        // Assert
        expect(result).toEqual({success: false, message: "Gagal mengubah roles ke pegawai."});
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
    });

    // 🧪 Skenario 4: Gagal karena sebagian role tidak ditemukan di DB
    it("should return a specific failure message if some roles are not found", async () => {
    // Arrange
        const employeeId = "peg-004";
        const rolesPayload = {roles: ["admin", "role-tidak-ada"]};
        // Simulasikan DB hanya menemukan satu dari dua role
        const mockRolesFromDb = [{roleid: "role-01", name: "admin"}];
        client.query.mockResolvedValue({rows: mockRolesFromDb});

        // Act
        const result = await insertRolesToEmployee(employeeId, rolesPayload);

        // Assert
        expect(result.success).toBe(false);
        expect(result.message).toBe("Beberapa peran tidak ditemukan: role-tidak-ada.");

        // Sesuai logika kode, jika peran tidak ditemukan, fungsi langsung return
        // tanpa COMMIT atau ROLLBACK (transaksi menggantung, yang bisa jadi bug)
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
        expect(client.query).not.toHaveBeenCalledWith("ROLLBACK");
        expect(client.release).toHaveBeenCalledTimes(1);
    });

    // 🧪 Skenario 5: Gagal karena error database
    it("should rollback if the DELETE query fails", async () => {
    // Arrange
        const employeeId = "peg-005";
        const rolesPayload = {roles: ["admin"]};
        const databaseError = new Error("DELETE statement failed");

        client.query.mockImplementation((query) => {
            // Simulasikan DB menemukan role
            if (query.includes("SELECT roleid, name FROM roles")) {
                return Promise.resolve({rows: [{roleid: "role-01", name: "admin"}]});
            }
            // Simulasikan query DELETE gagal
            if (query.includes("DELETE FROM")) {
                return Promise.reject(databaseError);
            }
            return Promise.resolve(); // Untuk BEGIN
        });

        // Act
        const result = await insertRolesToEmployee(employeeId, rolesPayload);

        // Assert
        expect(result).toEqual({success: false, message: "Gagal mengubah roles ke pegawai."});
        expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
    });
});
