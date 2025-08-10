// Import controller yang akan diuji
const createEmployee = require("../../src/controllers/createEmployee");

// Mock dependensi eksternal (service)
jest.mock("../../src/services/urmService", () => ({
    insertEmployeeDetailsToDb: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const {insertEmployeeDetailsToDb} = require("../../src/services/urmService");

describe("createEmployee Controller", () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
    // Siapkan request body yang valid sebagai default
        mockRequest = {
            body: {
                employeeId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
                fullName: "Budi Santoso",
                email: "budi.s@example.com",
                department: "Teknologi",
                position: "Software Engineer",
                roleName: "USER",
            },
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ================= Skenario Sukses =================

    test("should create an employee and return 201 on success", async () => {
    // ARRANGE: Simulasikan service berhasil
        insertEmployeeDetailsToDb.mockResolvedValue({success: true});

        // ACT: Jalankan controller
        await createEmployee(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(insertEmployeeDetailsToDb).toHaveBeenCalledWith(
            "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
            "Budi Santoso", "budi.s@example.com",
            "Teknologi",
            "Software Engineer",
            "USER",
        );
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true, message: "Pegawai berhasil didaftarkan"});
    });

    // ================= Skenario Gagal =================

    test("should return 400 if request body is undefined", async () => {
    // ARRANGE: Atur body menjadi undefined
        mockRequest.body = undefined;

        // ACT: Jalankan controller
        await createEmployee(mockRequest, mockResponse);

        // ASSERT: Pastikan service tidak dipanggil dan respons 400 dikirim
        expect(insertEmployeeDetailsToDb).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Input tidak valid."});
    });

    test("should return 400 if any required field is missing", async () => {
    // ARRANGE: Hapus salah satu field wajib (email)
        delete mockRequest.body.email;

        // ACT: Jalankan controller
        await createEmployee(mockRequest, mockResponse);

        // ASSERT: Pastikan service tidak dipanggil dan respons 400 dikirim
        expect(insertEmployeeDetailsToDb).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({error: "Missing employee data"});
    });

    test("should return 400 if database insertion fails", async () => {
    // ARRANGE: Simulasikan service gagal dengan pesan spesifik
        const failureMessage = "Email sudah terdaftar.";
        insertEmployeeDetailsToDb.mockResolvedValue({success: false, message: failureMessage});

        // ACT: Jalankan controller
        await createEmployee(mockRequest, mockResponse);

        // ASSERT: Periksa respons error dari service
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({success: false, message: failureMessage});
    });

    test("should return 500 on internal server error", async () => {
    // ARRANGE: Simulasikan service melempar error tak terduga
        const dbError = new Error("Koneksi database gagal");
        insertEmployeeDetailsToDb.mockRejectedValue(dbError);

        // ACT: Jalankan controller
        await createEmployee(mockRequest, mockResponse);

        // ASSERT: Pastikan blok catch berjalan benar
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({success: false, message: "Terjadi kesalahan internal server."});
    });
});
