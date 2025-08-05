// Import controller yang akan diuji
const addRole = require("../../src/controllers/addRole");

// Mock dependensi eksternal: service dan uuid
// Ini memberitahu Jest untuk mengganti fungsi asli dengan versi simulasi kita
jest.mock("../../src/services/urmService", () => ({
    findRoleByName: jest.fn(),
    insertRoleToDb: jest.fn(),
}));
jest.mock("uuid", () => ({
    v4: jest.fn(),
}));

// Import versi mock dari service dan uuid untuk dikontrol dalam tes
const {findRoleByName, insertRoleToDb} = require("../../src/services/urmService");
const {v4: uuidv4} = require("uuid");


describe("addRole Controller", () => {
    let mockRequest;
    let mockResponse;

    // Atur ulang mock object sebelum setiap tes
    beforeEach(() => {
        mockRequest = {
            body: {
                name: "test_role",
                display_name: "Test Role",
                description: "A role for testing purposes.",
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mengatur console.error agar tidak menampilkan log error saat tes sengaja dibuat gagal
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    // Bersihkan semua mock setelah setiap tes untuk memastikan tes terisolasi
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ================= Skenario Sukses =================

    test("should add a new role successfully and return 200", async () => {
    // ARRANGE: Siapkan kondisi
    // 1. findRoleByName mengembalikan array kosong (role belum ada)
        findRoleByName.mockResolvedValue([]);
        // 2. insertRoleToDb berhasil
        insertRoleToDb.mockResolvedValue({success: true});
        // 3. Atur UUID yang akan digenerate agar bisa diprediksi
        const fakeUuid = "123e4567-e89b-12d3-a456-426614174000";
        uuidv4.mockReturnValue(fakeUuid);

        // ACT: Jalankan controller
        await addRole(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findRoleByName).toHaveBeenCalledWith("test_role");
        expect(uuidv4).toHaveBeenCalledTimes(1);
        expect(insertRoleToDb).toHaveBeenCalledWith(
            fakeUuid,
            "test_role",
            "Test Role",
            "A role for testing purposes.",
        );
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Berhasil menambahkan role"});
    });

    // ================= Skenario Gagal =================

    test("should return 409 if role already exists", async () => {
    // ARRANGE: Simulasikan findRoleByName menemukan role yang sudah ada
        findRoleByName.mockResolvedValue([{id: "some-id", name: "test_role"}]);

        // ACT: Jalankan controller
        await addRole(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findRoleByName).toHaveBeenCalledWith("test_role");
        expect(insertRoleToDb).not.toHaveBeenCalled(); // Pastikan insert TIDAK dipanggil
        expect(mockResponse.status).toHaveBeenCalledWith(409);
        expect(mockResponse.json).toHaveBeenCalledWith({error: "Role sudah ada"});
    });

    test("should return 400 if database insertion fails", async () => {
    // ARRANGE: Simulasikan insertRoleToDb gagal dengan pesan error
        findRoleByName.mockResolvedValue([]);
        insertRoleToDb.mockResolvedValue({success: false, message: "Gagal menyimpan ke database"});
        uuidv4.mockReturnValue("some-fake-uuid");

        // ACT: Jalankan controller
        await addRole(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({error: "Gagal menyimpan ke database"});
    });

    test("should return 500 on internal server error", async () => {
    // ARRANGE: Simulasikan findRoleByName melempar error tak terduga
        const dbError = new Error("Koneksi database terputus");
        findRoleByName.mockRejectedValue(dbError);

        // ACT: Jalankan controller
        await addRole(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(console.error).toHaveBeenCalledWith(dbError); // Pastikan error di-log
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({error: "Terjadi kesalahan internal server"});
    });
});
