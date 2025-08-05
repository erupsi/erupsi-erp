// Impor fungsi yang akan diuji
const {insertEmployeeDetailsToDb} = require("../../src/services/urmService"); // Sesuaikan path jika perlu

// Mock modul 'pg' secara otomatis
jest.mock("pg");

// Impor mock Pool dan dapatkan instance mock client
const {Pool} = require("pg");
const pool = new Pool(); // Ini adalah mock pool

// Kelompokkan tes untuk fungsi insertEmployeeDetailsToDb
describe("insertEmployeeDetailsToDb", () => {
    let client;

    beforeAll(async () => {
        client = await pool.connect(); // 3. Pindahkan `await` ke dalam fungsi async ini
    });

    // Bersihkan semua riwayat pemanggilan mock setelah setiap tes
    afterEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 Tes 1: Skenario sukses
    it("should insert employee and role details successfully and commit the transaction", async () => {
    // Arrange
        const employeeData = {
            employeeId: "emp-001",
            fullName: "Rina Kartika",
            email: "rina.k@example.com",
            department: "Marketing",
            position: "Digital Strategist",
            roleName: "editor",
        };
        const mockRoleId = "role-abc-123";

        // Sekarang client sudah terdefinisi, mock ini akan bekerja
        client.query.mockImplementation((query) => {
            if (query.includes("SELECT roleId FROM roles")) {
                return Promise.resolve({rows: [{roleid: mockRoleId}]});
            }
            return Promise.resolve({rows: []});
        });

        // Act
        const result = await insertEmployeeDetailsToDb(...Object.values(employeeData));

        // Assert
        expect(result).toEqual({success: true, message: "Employee details inserted successfully"});
        expect(client.query).toHaveBeenCalledWith("COMMIT");
        expect(client.release).toHaveBeenCalledTimes(1);
    });


    // 🧪 Tes 2: Skenario gagal karena role tidak ditemukan
    it("should rollback the transaction if the role name does not exist", async () => {
    // Arrange: Siapkan data dan atur agar query SELECT role mengembalikan array kosong
        const employeeData = {
            employeeId: "emp-002",
            fullName: "Budi Santoso",
            email: "budi.s@test.com",
            department: "IT",
            position: "Support",
            roleName: "non-existent-role",
        };
        client.query.mockImplementation((query) => {
            // Jika query untuk mencari role
            if (query.includes("SELECT roleId FROM roles")) {
                // Secara spesifik kembalikan array kosong untuk query ini
                return Promise.resolve({rows: []});
            }
            // Untuk semua query lain (seperti BEGIN dan INSERT pertama),
            // kembalikan hasil sukses standar.
            return Promise.resolve({rows: [{}]});
        }); // Simulasi role tidak ditemukan

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // Act
        const result = await insertEmployeeDetailsToDb(...Object.values(employeeData));

        // Assert
        expect(result).toEqual({success: false, message: "Failed to insert employee details"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("ROLLBACK"); // Pastikan ROLLBACK dipanggil
        expect(client.query).not.toHaveBeenCalledWith("COMMIT"); // Pastikan COMMIT tidak dipanggil
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), expect.any(Error));
        expect(client.release).toHaveBeenCalledTimes(1);

        consoleSpy.mockRestore();
    });


    // 🧪 Tes 3: Skenario gagal karena error saat INSERT ke tabel employees
    it("should rollback the transaction if inserting into employees table fails", async () => {
    // Arrange: Siapkan error palsu untuk dilempar saat query INSERT pertama
        const dbError = new Error("Unique constraint violation");

        // Gunakan mockImplementation untuk mengontrol perilaku query secara dinamis
        client.query.mockImplementation((query) => {
            if (query.includes("INSERT INTO employees")) {
                return Promise.reject(dbError); // Lemparkan error pada query INSERT employee
            }
            // Untuk query lain seperti 'BEGIN' atau 'SELECT'
            return Promise.resolve({rows: [{roleid: "role-xyz"}]});
        });

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const employeeData = {employeeId: "emp-003",
            fullName: "Citra Lestari",
            email: "citra.l@test.com",
            department: "HR",
            position: "Recruiter",
            roleName: "hr-staff",
        };

        // Act
        const result = await insertEmployeeDetailsToDb(...Object.values(employeeData));

        // Assert
        expect(result).toEqual({success: false, message: "Failed to insert employee details"});

        // Verifikasi alur transaksi
        expect(client.query).toHaveBeenCalledWith("BEGIN");
        expect(client.query).toHaveBeenCalledWith("ROLLBACK");
        expect(client.query).not.toHaveBeenCalledWith("COMMIT");
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), dbError);
        expect(client.release).toHaveBeenCalledTimes(1);

        consoleSpy.mockRestore();
    });
});
