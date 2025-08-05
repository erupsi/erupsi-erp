const validateEmployeeIdOnParam = require("../../src/middlewares/validateEmployeeIdOnParam");

describe("validateEmployeeIdOnParam Middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;

    // Atur ulang mock object sebelum setiap tes dijalankan
    beforeEach(() => {
    // Fokus utama tes ini adalah 'req.params'
        mockRequest = {
            params: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });

    // ================= Skenario Sukses (Valid) =================

    test("should call next() when employeeId in params is a valid UUID", async () => {
    // Siapkan UUID v4 yang valid sebagai parameter
        mockRequest.params.employeeId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

        // Pisahkan dan jalankan rantai middleware
        const [validator, resultChecker] = validateEmployeeIdOnParam;
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        // Verifikasi: next() harus dipanggil dan tidak ada respons error
        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    // ================= Skenario Gagal (Tidak Valid) =================

    test("should return 400 when employeeId is not a valid UUID", async () => {
    // Siapkan ID yang tidak valid
        mockRequest.params.employeeId = "ini-bukan-uuid-123";
        const [validator, resultChecker] = validateEmployeeIdOnParam;

        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        // Verifikasi: next() tidak dipanggil, dan respons 400 dikirim
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: [expect.stringContaining("Format Employee ID tidak valid. Harap gunakan format UUID.")],
        });
    });

    test("should return 400 when employeeId parameter is missing", async () => {
    // Biarkan mockRequest.params kosong untuk mensimulasikan parameter yang hilang
        const [validator, resultChecker] = validateEmployeeIdOnParam;

        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        // Verifikasi: next() tidak dipanggil, dan respons 400 dikirim
        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: [expect.stringContaining("Format Employee ID tidak valid. Harap gunakan format UUID.")],
        });
    });
});
