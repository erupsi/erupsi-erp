// Ganti path ini sesuai dengan struktur proyek Anda
const validateEmployeeIdOnParam = require("../../src/middlewares/validateEmployeeIdOnParam");

/**
 * Helper function untuk menjalankan rantai middleware secara berurutan,
 * meniru cara kerja Express. Ini lebih andal daripada memanggil
 * setiap fungsi middleware secara manual.
 */
/**
 * Executes an array of Express-style middleware functions sequentially.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object. Should have `finalNext` method to be called after all middlewares.
 * @param {Function[]} middlewares - An array of middleware functions to execute.
 * Each middleware receives (req, res, next).
 * @return {Promise<void>} Resolves when all middleware have been executed.
 */
const runMiddleware = async (req, res, middlewares) => {
    for (const middleware of middlewares) {
        const callCountBefore = res.status.mock.calls.length;

        // Menjalankan setiap middleware dan menunggunya selesai.
        // Kita memberikan fungsi 'next' kosong karena alur async dikontrol oleh 'await'.
        await middleware(req, res, () => {});

        const callCountAfter = res.status.mock.calls.length;

        // Jika jumlah pemanggilan 'res.status' bertambah, artinya middleware
        // telah mengirim respons (misalnya error). Hentikan eksekusi.
        if (callCountAfter > callCountBefore) {
            break;
        }
    }

    // Di akhir, jika 'res.status' tidak pernah dipanggil sama sekali selama loop,
    // itu berarti semua middleware berhasil dan kita harus memanggil 'next' terakhir.
    if (res.status.mock.calls.length === 0) {
        res.finalNext();
    }
};


describe("validateEmployeeIdOnParam Middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;
    const validUUID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

    // Atur ulang mock object sebelum setiap tes dijalankan
    beforeEach(() => {
        // Fokus validasi adalah 'req.body'
        mockRequest = {
            body: {},
        };
        nextFunction = jest.fn();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            // 'finalNext' akan dipanggil jika semua middleware lolos
            finalNext: nextFunction,
        };
    });

    // ================= Skenario Sukses (Valid) =================

    test("should call next() when body contains a valid employeeId and no extra properties", async () => {
        mockRequest.body = {employeeId: validUUID};

        // Jalankan semua middleware dalam rantai
        await runMiddleware(mockRequest, mockResponse, validateEmployeeIdOnParam());

        // Verifikasi: next() harus dipanggil dan tidak ada respons error
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    // ================= Skenario Gagal (Tidak Valid) =================

    test("should return 400 when employeeId is not a valid UUID", async () => {
        mockRequest.body = {employeeId: "ini-bukan-uuid-123"};

        await runMiddleware(mockRequest, mockResponse, validateEmployeeIdOnParam());

        // Verifikasi: next() tidak dipanggil, dan respons 400 dikirim
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        // Periksa pesan error dan format JSON yang baru
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: ["employeeId type must be UUID."],
        });
    });

    test("should return 400 when employeeId is missing or empty", async () => {
        // Biarkan mockRequest.body kosong
        await runMiddleware(mockRequest, mockResponse, validateEmployeeIdOnParam());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        // Periksa pesan error yang sesuai untuk 'notEmpty'
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: ["employeeId cannot be empty."],
        });
    });

    // TEST CASE BARU: Untuk memeriksa validasi properti ekstra
    test("should return 400 if the body contains extra properties", async () => {
        mockRequest.body = {
            employeeId: validUUID,
            name: "John Doe", // Properti ekstra yang tidak diizinkan
        };

        await runMiddleware(mockRequest, mockResponse, validateEmployeeIdOnParam());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: [expect.stringContaining("Properti yang tidak diizinkan terdeteksi")],
        });
    });

    test("should return multiple errors if multiple validations fail", async () => {
        mockRequest.body = {
            employeeId: "bukan-uuid", // Error 1: Format salah
            extraKey: "test", // Error 2: Properti ekstra
        };

        await runMiddleware(mockRequest, mockResponse, validateEmployeeIdOnParam());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: expect.arrayContaining([
                "employeeId type must be UUID.",
                expect.stringContaining("Properti yang tidak diizinkan terdeteksi:"),
            ]),
        });
    });
});
