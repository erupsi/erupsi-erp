// Import controller yang akan diuji
const getAllRoles = require("../../src/controllers/getAllRoles");

// Mock dependensi eksternal (service)
jest.mock("../../src/services/urmService", () => ({
    findAllRoles: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const {findAllRoles} = require("../../src/services/urmService");

describe("getAllRoles Controller", () => {
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
    // Request tidak membawa data, jadi bisa objek kosong
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Mengatur console.error agar tidak menampilkan log saat tes sengaja dibuat gagal
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ================= Skenario Sukses =================

    test("should return a list of roles and status 200 if roles are found", async () => {
    // ARRANGE: Simulasikan service mengembalikan data role
        const mockRoles = [
            {id: "1", name: "ADMIN"},
            {id: "2", name: "USER"},
        ];
        findAllRoles.mockResolvedValue(mockRoles);

        // ACT: Jalankan controller
        await getAllRoles(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findAllRoles).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true, data: mockRoles});
    });

    test("should return an empty list and status 200 if no roles are found", async () => {
    // ARRANGE: Simulasikan service tidak menemukan data (array kosong)
        findAllRoles.mockResolvedValue([]);

        // ACT: Jalankan controller
        await getAllRoles(mockRequest, mockResponse);

        // ASSERT: Periksa hasilnya
        expect(findAllRoles).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true, data: []});
    });


    // ================= Skenario Gagal =================

    test("should return 500 on internal server error", async () => {
    // ARRANGE: Simulasikan service melempar error tak terduga
        const dbError = new Error("Query to database failed");
        findAllRoles.mockRejectedValue(dbError);

        // ACT: Jalankan controller
        await getAllRoles(mockRequest, mockResponse);

        // ASSERT: Pastikan blok catch berjalan benar
        expect(console.error).toHaveBeenCalledWith("Error in GET /urm/roles", dbError.message);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({error: "Internal server error."});
    });
});
