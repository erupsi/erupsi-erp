const patchRoleValidator = require('../../src/middlewares/patchRoleUpdateValidator'); // Sesuaikan path jika perlu

describe('patchRoleValidator Middleware', () => {

  let mockRequest;
  let mockResponse;
  let nextFunction;

  // Atur ulang mock object sebelum setiap tes dijalankan
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

  test('should call next() for a valid request with a roles array', async () => {
    mockRequest.body = {
      roles: ["SYSTEM_ADMIN", "USER"]
    };
    const [validator, resultChecker] = patchRoleValidator();

    // Jalankan rantai middleware
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    // Harapannya, next() dipanggil dan tidak ada error
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  test('should call next() for a request with an empty roles array', async () => {
    mockRequest.body = {
      roles: []
    };
    const [validator, resultChecker] = patchRoleValidator();
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
  
  test('should call next() for an empty request body', async () => {
    mockRequest.body = {}; // Body kosong valid untuk PATCH
    
    const [validator, resultChecker] = patchRoleValidator();
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });


  // ================= Skenario Gagal (Tidak Valid) =================

  test('should return 400 if body contains a disallowed field', async () => {
    mockRequest.body = {
      username: "test-user" // Field ini tidak diizinkan
    };
    const [validator, resultChecker] = patchRoleValidator();
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    // Harapannya, next() tidak dipanggil dan status 400 dikirim
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [expect.stringContaining("Properti 'username' tidak diizinkan untuk diupdate.")]
    });;
  });

  test('should return 400 if roles property is not an array', async () => {
    mockRequest.body = {
      roles: "SYSTEM_ADMIN" // Tipe data salah, seharusnya array
    };
    const [validator, resultChecker] = patchRoleValidator();
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [expect.stringContaining("Properti 'roles' harus berupa array.")]
    });
  });

  test('should return 400 if roles array contains non-string elements', async () => {
    mockRequest.body = {
      roles: ["SYSTEM_ADMIN", 123, true] // Mengandung number dan boolean
    };
    const [validator, resultChecker] = patchRoleValidator();
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [expect.stringContaining('Semua elemen dalam "roles" harus berupa string.')]
    });
  });

  test('should return 400 and list multiple errors for multiple invalid fields', async () => {
    mockRequest.body = {
      username: "test-user", // Field tidak diizinkan
      roles: 12345 // Tipe data salah
    };
    const [validator, resultChecker] = patchRoleValidator();
    await validator(mockRequest, mockResponse, () => {});
    await resultChecker(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // Dapatkan pesan error gabungan dari respons JSON
    const errorResponse = mockResponse.json.mock.calls[0][0];
    const errorMessage = errorResponse.errors[0];

    // Cek apakah kedua pesan error ada di dalam string gabungan
    expect(errorMessage).toEqual("Properti 'username' tidak diizinkan untuk diupdate. Properti 'roles' harus berupa array.");
  });
});