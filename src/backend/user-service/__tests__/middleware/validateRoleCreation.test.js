const validateRoleCreation = require("../../src/middlewares/validateRoleCreationReq"); // Sesuaikan path jika perlu

// Helper untuk menjalankan rantai middleware express-validator dengan benar
const runMiddlewareChain = async (req, res, next, middlewareChain) => {
    const validationRules = middlewareChain.slice(0, -1);
    const resultChecker = middlewareChain[middlewareChain.length - 1];

    for (const rule of validationRules) {
        await rule(req, res, () => {});
    }
    await resultChecker(req, res, next);
};


describe("validateRoleCreation Middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;

    beforeEach(() => {
        mockRequest = {body: {}};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });

    // ================= Skenario Sukses (Valid) =================

    test("should call next() for a valid request body", async () => {
        mockRequest.body = {
            name: "admin",
            display_name: "Administrator",
            description: "Peran dengan akses penuh ke sistem.",
        };

        await runMiddlewareChain(mockRequest, mockResponse, nextFunction, validateRoleCreation());

        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    // ================= Skenario Gagal (Tidak Valid) =================

    test("should return 400 if an unallowed property is provided", async () => {
        mockRequest.body = {
            name: "admin",
            display_name: "Administrator",
            description: "Peran dengan akses penuh.",
            is_active: true, // Properti tidak diizinkan
        };

        await runMiddlewareChain(mockRequest, mockResponse, nextFunction, validateRoleCreation());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        // PEMBARUAN: Cek array berisi string pesan
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: [expect.stringContaining("Properti yang tidak diizinkan terdeteksi:")],
        });
    });

    test("should return 400 if the name field is empty", async () => {
        mockRequest.body = {
            name: "",
            display_name: "User Biasa",
            description: "Peran untuk pengguna biasa.",
        };

        await runMiddlewareChain(mockRequest, mockResponse, nextFunction, validateRoleCreation());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        // PEMBARUAN: Cek array berisi string pesan
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: ["Nama peran tidak boleh kosong."],
        });
    });

    test("should return 400 if display_name is not a string", async () => {
        mockRequest.body = {
            name: "editor",
            display_name: 12345,
            description: "Peran untuk editor konten.",
        };

        await runMiddlewareChain(mockRequest, mockResponse, nextFunction, validateRoleCreation());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        // PEMBARUAN: Cek array berisi string pesan
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: ["Nama tampilan harus berupa string."],
        });
    });

    test("should return multiple errors for multiple invalid fields", async () => {
        mockRequest.body = {
            name: "guest",
            display_name: "", // tidak boleh kosong
            // description tidak ada
        };

        await runMiddlewareChain(mockRequest, mockResponse, nextFunction, validateRoleCreation());

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);

        // PEMBARUAN: Langsung cek isi array pesan error
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                "Nama tampilan peran tidak boleh kosong.",
                "Deskripsi tidak boleh kosong.",
            ]),
        });

        // Opsional: Cek panjang array jika perlu
        const {errors} = mockResponse.json.mock.calls[0][0];
        expect(errors).toHaveLength(2);
    });
});
