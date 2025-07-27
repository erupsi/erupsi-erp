// Impor fungsi yang akan diuji
const { findRoleByName } = require('../../src/services/urmService'); // Sesuaikan path

// Setup mock untuk modul 'pg'
jest.mock('pg');
const { Pool } = require('pg');
const pool = new Pool();

// Kelompokkan tes untuk fungsi findRoleByName
describe('findRoleByName', () => {
  // Bersihkan semua mock setelah setiap tes
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 Skenario 1: Peran berhasil ditemukan
  it('should return an array containing the role object when found', async () => {
    // Arrange: Siapkan data palsu seolah-olah peran ditemukan
    const roleName = 'admin';
    const mockRoleData = {
      roleid: 'role-admin-123',
      name: 'admin',
      display_name: 'Administrator',
      description: 'Super user',
    };
    const mockDbResult = { rows: [mockRoleData] };
    pool.query.mockResolvedValue(mockDbResult);

    // Act: Panggil fungsi yang diuji
    const result = await findRoleByName(roleName);

    // Assert: Pastikan hasilnya adalah array yang berisi objek peran
    expect(result).toEqual([mockRoleData]);
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM roles WHERE name = $1;', [roleName]);
  });

  // 🧪 Skenario 2: Peran tidak ditemukan
  it('should return an empty array if the role is not found', async () => {
    // Arrange: Siapkan mock dengan array rows yang kosong
    const roleName = 'non-existent-role';
    const mockDbResult = { rows: [] };
    pool.query.mockResolvedValue(mockDbResult);

    // Act
    const result = await findRoleByName(roleName);

    // Assert
    expect(result).toEqual([]); // Hasilnya harus array kosong
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // 🧪 Skenario 3: Terjadi error pada database
  it('should throw an error if the database query fails', async () => {
    // Arrange: Atur mock untuk melempar error
    const roleName = 'any-role';
    const databaseError = new Error('Connection failed');
    pool.query.mockRejectedValue(databaseError);

    // Act & Assert: Verifikasi bahwa fungsi akan melempar error yang sama
    await expect(findRoleByName(roleName)).rejects.toThrow('Connection failed');
  });
});