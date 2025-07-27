// Impor fungsi yang akan diuji
const { findEmployeeDetailByEmployeeId } = require('../../src/services/urmService'); // Sesuaikan path jika perlu

// Beritahu Jest untuk menggunakan mock dari modul 'pg'
// Ini bisa menggunakan __mocks__/pg.js atau konfigurasi moduleNameMapper di jest.config.js
jest.mock('pg');

// Impor mock Pool untuk kita kontrol dalam tes
const { Pool } = require('pg');

// Dapatkan instance dari mock pool
const pool = new Pool();

// Kelompokkan semua tes untuk fungsi findEmployeeDetailByEmployeeId
describe('findEmployeeDetailByEmployeeId', () => {

  // Jalankan fungsi ini setelah setiap tes selesai untuk membersihkan mock.
  // Ini penting agar tes tidak saling mempengaruhi.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 Tes Skenario 1: Pegawai berhasil ditemukan (Happy Path)
  it('should return employee details for a valid employeeId', async () => {
    // Arrange: Siapkan data palsu yang akan dikembalikan oleh database
    const mockEmployeeData = {
      full_name: 'Andi Wijaya',
      email: 'andi.wijaya@example.com',
      department: 'Technology',
      position: 'Lead Engineer',
      roles: ['admin', 'engineer'],
    };

    // Atur agar pool.query mengembalikan data palsu di atas
    pool.query.mockResolvedValueOnce({ rows: [mockEmployeeData] });

    const employeeIdToFind = 'emp-001';

    // Act: Panggil fungsi yang sedang diuji
    const result = await findEmployeeDetailByEmployeeId(employeeIdToFind);

    // Assert: Verifikasi bahwa hasilnya sesuai harapan
    expect(result).toEqual(mockEmployeeData); // Hasilnya harus sama dengan data mock
    expect(pool.query).toHaveBeenCalledTimes(1); // Pastikan query dipanggil tepat 1 kali
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [employeeIdToFind]); // Pastikan query dipanggil dengan argumen yang benar
  });

  // 🧪 Tes Skenario 2: Pegawai tidak ditemukan
  it('should return undefined when the employeeId does not exist', async () => {
    // Arrange: Atur agar pool.query mengembalikan array kosong
    pool.query.mockResolvedValueOnce({ rows: [] });

    const nonExistentId = 'emp-999';

    // Act: Panggil fungsi
    const result = await findEmployeeDetailByEmployeeId(nonExistentId);

    // Assert: Verifikasi hasilnya
    expect(result).toBeUndefined(); // Sesuai logika di fungsi, hasilnya harus undefined
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [nonExistentId]);
  });

  // 🧪 Tes Skenario 3: Terjadi error pada database
  it('should return undefined if the database query throws an error', async () => {
    // Arrange: Atur agar pool.query melempar sebuah error (reject promise)
    const databaseError = new Error('Connection refused');
    pool.query.mockRejectedValueOnce(databaseError);

    // Kita juga bisa memata-matai `console.error` untuk memastikan error dicatat
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const anyId = 'emp-error';

    // Act: Panggil fungsi
    const result = await findEmployeeDetailByEmployeeId(anyId);

    // Assert: Verifikasi hasilnya
    expect(result).toBeUndefined(); // Sesuai blok catch, hasilnya harus undefined
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled(); // Pastikan console.error dipanggil

    // Membersihkan spy setelah tes selesai
    consoleSpy.mockRestore();
  });
});