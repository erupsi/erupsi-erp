// Import controller yang akan diuji
const assignRoleToEmployee = require('../../src/controllers/assignRoleToEmployee');

// Mock dependensi eksternal (service)
jest.mock('../../src/services/urmService', () => ({
  checkEmployeeById: jest.fn(),
  insertRolesToEmployee: jest.fn(),
}));

// Import versi mock dari service untuk dikontrol dalam tes
const { checkEmployeeById, insertRolesToEmployee } = require('../../src/services/urmService');

describe('assignRoleToEmployee Controller', () => {

  let mockRequest;
  let mockResponse;
  const validUuid = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

  beforeEach(() => {
    mockRequest = {
      params: {
        employeeId: validUuid,
      },
      body: {
        roles: ['USER', 'EDITOR'],
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

  test('should assign roles and return 200 on success', async () => {
    // ARRANGE: Simulasikan semua panggilan service berhasil
    checkEmployeeById.mockResolvedValue({ success: true });
    insertRolesToEmployee.mockResolvedValue({ success: true });

    // ACT: Jalankan controller
    await assignRoleToEmployee(mockRequest, mockResponse);

    // ASSERT: Periksa hasilnya
    expect(checkEmployeeById).toHaveBeenCalledWith(validUuid);
    expect(insertRolesToEmployee).toHaveBeenCalledWith(validUuid, mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: "Role pegawai berhasil diubah" });
  });

  // ================= Skenario Gagal =================

  test('should return 400 for an invalid employee ID format', async () => {
    // ARRANGE: Gunakan ID yang tidak valid
    mockRequest.params.employeeId = 'id-tidak-valid';

    // ACT: Jalankan controller
    await assignRoleToEmployee(mockRequest, mockResponse);

    // ASSERT: Pastikan tidak ada panggilan service dan respons 400 dikirim
    expect(checkEmployeeById).not.toHaveBeenCalled();
    expect(insertRolesToEmployee).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid employee ID format" });
  });

  test('should return 404 if employee is not found', async () => {
    // ARRANGE: Simulasikan service tidak menemukan pegawai
    checkEmployeeById.mockResolvedValue({ success: false });

    // ACT: Jalankan controller
    await assignRoleToEmployee(mockRequest, mockResponse);

    // ASSERT: Pastikan insert tidak dipanggil dan respons 404 dikirim
    expect(checkEmployeeById).toHaveBeenCalledWith(validUuid);
    expect(insertRolesToEmployee).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Pegawai tidak ditemukan.' });
  });

  test('should return 400 if role assignment fails', async () => {
    // ARRANGE: Simulasikan pegawai ditemukan, tetapi proses insert gagal
    checkEmployeeById.mockResolvedValue({ success: true });
    insertRolesToEmployee.mockResolvedValue({ success: false, message: "Gagal mengubah role" });

    // ACT: Jalankan controller
    await assignRoleToEmployee(mockRequest, mockResponse);

    // ASSERT: Periksa respons error dari service
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Gagal mengubah role" });
  });

  test('should return 500 on internal server error', async () => {
    // ARRANGE: Simulasikan service melempar error tak terduga
    const serviceError = new Error("Koneksi ke DB gagal");
    checkEmployeeById.mockRejectedValue(serviceError);

    // ACT: Jalankan controller
    await assignRoleToEmployee(mockRequest, mockResponse);

    // ASSERT: Pastikan blok catch berjalan benar
    expect(console.error).toHaveBeenCalledWith(serviceError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Terjadi kesalahan server internal" });
  });
});