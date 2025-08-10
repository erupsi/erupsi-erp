const patchBodyValidator = require("../../src/middlewares/patchBodyValidator"); // Sesuaikan path jika perlu

describe("patchBodyValidator Middleware", () => {
    let mockRequest;
    let mockResponse;
    let nextFunction;

    // Atur ulang mock object sebelum setiap tes
    beforeEach(() => {
        mockRequest = {
            body: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });

    // ================= Skenario Sukses (Valid) =================

    test("should call next() for a valid request with allowed fields", async () => {
        mockRequest.body = {
            full_name: "Jane Doe",
            position: "Senior Developer",
        };

        const [validator, resultChecker] = patchBodyValidator();

        // 1. Jalankan validator, yang akan menambahkan hasil ke 'req'
        await validator(mockRequest, mockResponse, () => {});
        // 2. Jalankan pemeriksa hasil, yang akan memanggil 'nextFunction'
        await resultChecker(mockRequest, mockResponse, nextFunction);

        // Harapannya, 'nextFunction' dipanggil
        expect(nextFunction).toHaveBeenCalledTimes(1);
        // Dan tidak ada respons error yang dikirim
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });

    test("should call next() for an empty request body", async () => {
        mockRequest.body = {}; // Body kosong valid untuk PATCH

        const [validator, resultChecker] = patchBodyValidator();
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).not.toHaveBeenCalled();
    });


    // ================= Skenario Gagal (Tidak Valid) =================

    test("should return 400 if body contains a disallowed field", async () => {
        mockRequest.body = {
            full_name: "John Doe",
            role: "admin", // Field 'role' tidak diizinkan
        };

        const [validator, resultChecker] = patchBodyValidator();
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled(); // next() tidak boleh dipanggil
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: ["Properti 'role' tidak diizinkan untuk diupdate."],
        });
    });

    test("should return 400 if an allowed field has the wrong data type", async () => {
        mockRequest.body = {
            email: 12345, // 'email' seharusnya string, bukan number
        };

        const [validator, resultChecker] = patchBodyValidator();
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: ["Email harus berupa string."],
        });
    });

    test("should return 400 and list multiple errors for multiple invalid fields", async () => {
        mockRequest.body = {
            id: "user-123", // Field tidak diizinkan
            full_name: false, // Tipe data salah
            department: "Engineering", // Field valid
        };

        const [validator, resultChecker] = patchBodyValidator();
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);

        const {errors} = mockResponse.json.mock.calls[0][0];

        expect(errors).toEqual(["Properti 'id' tidak diizinkan untuk diupdate., nama lengkap harus berupa string."]);
    // expect(errors).toContain("nama lengkap harus berupa string.");
    });

    test("should return 400 if department is not a string", async () => {
        mockRequest.body = {
            department: 12345, // Tipe data salah (number)
        };

        const [validator, resultChecker] = patchBodyValidator();
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: ["Department harus berupa string."],
        });
    });

    test("should return 400 if position is not a string", async () => {
        mockRequest.body = {
            position: true, // Tipe data salah (boolean)
        };

        const [validator, resultChecker] = patchBodyValidator();
        await validator(mockRequest, mockResponse, () => {});
        await resultChecker(mockRequest, mockResponse, nextFunction);

        expect(nextFunction).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            errors: ["Position harus berupa string."],
        });
    });
});
