// Import controller yang akan diuji
const getEmployeeDetail = require('../../src/controllers/getEmployeeDetail');

// Mock dependensi eksternal (service)
jest.mock('../../src/services/urmService', () => ({
  findEmployeeDetailByEmployeeId: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const { findEmployeeDetailByEmployeeId } = require('../../src/services/urmService');

describe('getEmployeeDetail Controller', () => {

  let mockRequest;
  let mockResponse;
  const testEmployeeId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

  beforeEach(() => {
    mockRequest = {
      params: {
        employeeId: testEmployeeId,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mengatur console.error agar tidak menampilkan log saat tes sengaja dibuat gagal
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= Skenario Sukses =================

  test('should return employee details and status 200 if employee is found', async () => {
    // ARRANGE: Simulasikan service mengembalikan data pegawai
    const mockEmployeeDetail = { 
      id: testEmployeeId, 
      fullName: 'Budi Santoso',
      email: 'budi.s@example.com' 
    };
    findEmployeeDetailByEmployeeId.mockResolvedValue(mockEmployeeDetail);

    // ACT: Jalankan controller
    await getEmployeeDetail(mockRequest, mockResponse);

    // ASSERT: Periksa hasilnya
    expect(findEmployeeDetailByEmployeeId).toHaveBeenCalledWith(testEmployeeId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockEmployeeDetail });
  });

  // ================= Skenario Gagal / Kasus Khusus =================

  test('should return 404 if no employee is found', async () => {
    // ARRANGE: Simulasikan service tidak menemukan data (mengembalikan null/falsy)
    findEmployeeDetailByEmployeeId.mockResolvedValue(null);

    // ACT: Jalankan controller
    await getEmployeeDetail(mockRequest, mockResponse);

    // ASSERT: Periksa respons 404
    expect(findEmployeeDetailByEmployeeId).toHaveBeenCalledWith(testEmployeeId);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: "Employee not found." });
  });

  test('should return 500 on internal server error', async () => {
    // ARRANGE: Simulasikan service melempar error tak terduga
    const dbError = new Error("Gagal menjalankan query detail");
    findEmployeeDetailByEmployeeId.mockRejectedValue(dbError);

    // ACT: Jalankan controller
    await getEmployeeDetail(mockRequest, mockResponse);

    // ASSERT: Pastikan blok catch berjalan benar
    expect(console.error).toHaveBeenCalledWith("Error in GET /employee/:employeeId:", dbError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      success: false, 
      message: "Internal server error.",
      error: dbError.message 
    });
  });
});