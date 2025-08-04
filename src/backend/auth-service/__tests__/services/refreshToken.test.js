// __tests__/services/refreshToken.test.js

// --- [PERUBAHAN KUNCI #1] ---
// Impor seluruh modul sebagai SATU OBJEK.
// Ini adalah langkah paling penting agar kita bisa memata-matai (spy) fungsi internal.
const refreshTokenService = require('../../src/services/RefreshToken');

// Impor dependensi eksternal yang akan kita mock
const jwt = require('jsonwebtoken');
const pool = require('../../src/services/db'); // Pastikan path ini benar
const crypto = require('crypto');

// Mock semua dependensi eksternal. Ini sudah benar.
jest.mock('jsonwebtoken');
jest.mock('../../src/services/db');
jest.mock('crypto');

// HAPUS mock untuk '../../src/services/RefreshToken' karena kita akan menggunakan spyOn

describe('Refresh Token Service', () => {
  const mockEmployeeId = 'emp-123';
  const mockUsername = 'testuser';
  const mockRoles = ['user'];
  let mockResponse;

  beforeEach(() => {
    // Membersihkan semua mock sebelum setiap tes berjalan
    jest.clearAllMocks();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    // Siapkan mock return value default untuk dependensi
    jwt.sign.mockReturnValue('mock-access-token');
    crypto.randomBytes.mockReturnValue({
      toString: jest.fn().mockReturnValue('mock-refresh-token-hex'),
    });
  });

  // --- [PERUBAHAN KUNCI #2] ---
  // Gunakan afterEach untuk membersihkan semua spy, mengembalikan fungsi ke kondisi asli.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Test suite for tokenBuilderAssigner ---
  describe('tokenBuilderAssigner', () => {
    test('should return accessToken and refreshToken without replacing if options.replace_token is false', async () => {
      // --- [PERUBAHAN KUNCI #3] ---
      // Buat spy pada method di objek refreshTokenService
      const replaceSpy = jest.spyOn(refreshTokenService, 'replaceRefreshTokenFromDB');

      // Panggil fungsi sebagai method dari objek refreshTokenService
      const result = await refreshTokenService.tokenBuilderAssigner(mockResponse, mockEmployeeId, mockUsername, mockRoles);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(crypto.randomBytes).toHaveBeenCalledTimes(1);
      
      // Sekarang assertion ini akan BENAR karena kita memantau spy yang benar
      expect(replaceSpy).not.toHaveBeenCalled();
      
      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token-hex',
      });
    });

    test('should replace token in DB if options.replace_token is true', async () => {
      // Buat spy dan mock implementasinya agar berhasil
      const replaceSpy = jest.spyOn(refreshTokenService, 'replaceRefreshTokenFromDB').mockResolvedValue(true);

      const result = await refreshTokenService.tokenBuilderAssigner(mockResponse, mockEmployeeId, mockUsername, mockRoles, { replace_token: true });

      // Sekarang assertion ini akan BENAR
      expect(replaceSpy).toHaveBeenCalledTimes(1);
      expect(replaceSpy).toHaveBeenCalledWith(mockEmployeeId, 'mock-refresh-token-hex', expect.any(Date));

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token-hex',
      });
    });

    test('should return 500 status if replaceRefreshTokenFromDB fails', async () => {
      // Buat spy dan mock implementasinya agar gagal
      const replaceSpy = jest.spyOn(refreshTokenService, 'replaceRefreshTokenFromDB').mockResolvedValue(false);

      await refreshTokenService.tokenBuilderAssigner(mockResponse, mockEmployeeId, mockUsername, mockRoles, { replace_token: true });

      // Sekarang assertion ini akan BENAR
      expect(replaceSpy).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
     test('should return 500 status if jwt.sign throws an error', async () => {
      // Atur agar jwt.sign melempar error
      const signError = new Error('JWT signing failed');
      jwt.sign.mockImplementation(() => {
        throw signError;
      });

      await refreshTokenService.tokenBuilderAssigner(mockResponse, mockEmployeeId, mockUsername, mockRoles);

      // Pastikan blok catch terpanggil dan mengirim status 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  // --- Test suite untuk fungsi lain (sebagian besar sudah benar, hanya perlu memastikan pemanggilan via objek) ---
  
  describe('replaceRefreshTokenFromDB', () => {
    test('should delete old token and insert new one', async () => {
      pool.query.mockResolvedValue({});
      const result = await refreshTokenService.replaceRefreshTokenFromDB(mockEmployeeId, 'new-token', new Date());

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM refresh_tokens WHERE employee_id = $1;', [mockEmployeeId]);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO refresh_tokens (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)',
        ['new-token', mockEmployeeId, expect.any(Date)]
      );
      expect(result).toBe(true);
    });
    test('should return false on database error', async () => {
      // Atur agar pool.query gagal
      pool.query.mockRejectedValue(new Error('DB error'));
      
      const result = await refreshTokenService.replaceRefreshTokenFromDB(mockEmployeeId, 'new-token', new Date());

      // Pastikan fungsi mengembalikan false seperti yang diharapkan di blok catch
      expect(result).toBe(false);
    });
  });
  
  describe('invalidateToken', () => {
    test('should call pool.query with correct query', async () => {
      pool.query.mockResolvedValue({});
      await refreshTokenService.invalidateToken(1);
      expect(pool.query).toHaveBeenCalledWith('UPDATE refresh_tokens SET is_valid = FALSE WHERE id = $1', [1]);
    });
  });

  describe('insertToken', () => {
    test('should call pool.query with correct query', async () => {
      pool.query.mockResolvedValue({});
      const expiryDate = new Date();
      await refreshTokenService.insertToken('new-token', mockEmployeeId, expiryDate);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO refresh_tokens (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)',
        ['new-token', mockEmployeeId, expiryDate]
      );
    });
  });

  // --- Test suite for invalidateAndInsertToken ---
  describe('invalidateAndInsertToken', () => {
    const mockTokenId = 1;
    const mockNewRefreshToken = 'new-refresh-token';
    const mockNewExpiry = new Date();

    test('should invalidate and insert token and commit transaction', async () => {
      // Buat spy untuk fungsi internal yang dipanggil
      const invalidateSpy = jest.spyOn(refreshTokenService, 'invalidateToken').mockResolvedValue();
      const insertSpy = jest.spyOn(refreshTokenService, 'insertToken').mockResolvedValue();
      
      // Mock pool.query untuk transaksi
      pool.query.mockResolvedValue({});

      await refreshTokenService.invalidateAndInsertToken(mockTokenId, mockNewRefreshToken, mockEmployeeId, mockNewExpiry);

      // Sekarang assertion ini akan BENAR
      expect(pool.query).toHaveBeenCalledWith('BEGIN');
      expect(invalidateSpy).toHaveBeenCalledWith(mockTokenId);
      expect(insertSpy).toHaveBeenCalledWith(mockNewRefreshToken, mockEmployeeId, mockNewExpiry);
      expect(pool.query).toHaveBeenCalledWith('COMMIT');
      expect(pool.query).not.toHaveBeenCalledWith('ROLLBACK');
    });

    test('should rollback transaction on error', async () => {
      // Buat spy untuk fungsi internal dan simulasikan error
      const invalidateSpy = jest.spyOn(refreshTokenService, 'invalidateToken').mockRejectedValue(new Error('Invalidate failed'));
      const insertSpy = jest.spyOn(refreshTokenService, 'insertToken');

      pool.query.mockResolvedValue({});

      await refreshTokenService.invalidateAndInsertToken(mockTokenId, mockNewRefreshToken, mockEmployeeId, mockNewExpiry);

      // Sekarang assertion ini akan BENAR
      expect(pool.query).toHaveBeenCalledWith('BEGIN');
      expect(invalidateSpy).toHaveBeenCalledWith(mockTokenId);
      expect(insertSpy).not.toHaveBeenCalled(); // Karena error terjadi sebelumnya
      expect(pool.query).not.toHaveBeenCalledWith('COMMIT');
      expect(pool.query).toHaveBeenCalledWith('ROLLBACK');
    });
    test('should rollback transaction on error', async () => {
      // Atur agar salah satu fungsi internal (invalidateToken) gagal
      const invalidateSpy = jest.spyOn(refreshTokenService, 'invalidateToken').mockRejectedValue(new Error('Invalidate failed'));
      const insertSpy = jest.spyOn(refreshTokenService, 'insertToken');

      pool.query.mockResolvedValue({});

      await refreshTokenService.invalidateAndInsertToken(mockTokenId, mockNewRefreshToken, mockEmployeeId, mockNewExpiry);

      // Pastikan 'ROLLBACK' dipanggil di dalam blok catch
      expect(pool.query).toHaveBeenCalledWith('ROLLBACK');
      expect(pool.query).not.toHaveBeenCalledWith('COMMIT');
    });
  });

  describe('deleteToken', () => {
    test('should call pool.query with correct query to delete a token', async () => {
      pool.query.mockResolvedValue({}); // Asumsikan query berhasil
      
      const tokenToDelete = 'token-to-delete-123';
      await refreshTokenService.deleteToken(tokenToDelete);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM refresh_tokens WHERE token_hash = $1', [tokenToDelete]);
    });
  });

  describe('updateToken', () => {
    test('should call pool.query with correct query to update a token', async () => {
      pool.query.mockResolvedValue({});
      const newExpiry = new Date();
      const newToken = 'new-updated-token';

      await refreshTokenService.updateToken(mockEmployeeId, newToken, newExpiry);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE refresh_tokens SET token_hash = $1, expires_at = $2 WHERE employee_id = $3',
        [newToken, newExpiry, mockEmployeeId]
      );
    });
  });

   describe('deleteTokenByEmpId', () => {
    test('should call pool.query with correct query to delete tokens by employee ID', async () => {
      pool.query.mockResolvedValue({});

      await refreshTokenService.deleteTokenByEmpId(mockEmployeeId);
      
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM refresh_tokens WHERE employee_id = $1', [mockEmployeeId]);
    });
  });
  // --- Test suite for searchRefreshToken ---
  describe('searchRefreshToken', () => {
    test('should return token data if found in database', async () => {
      // Arrange: Siapkan data palsu seolah-olah dari database
      const mockTokenData = [{
        id: 1,
        token_hash: 'token-yang-ada-di-db',
        employee_id: 'emp-123',
        is_valid: true,
        expires_at: '2025-12-31T23:59:59Z'
      }];
      const mockDbResult = { rows: mockTokenData };
      
      // Atur agar pool.query mengembalikan data palsu kita
      pool.query.mockResolvedValue(mockDbResult);

      const tokenToSearch = 'token-yang-ada-di-db';
      
      // Act: Panggil fungsi yang diuji
      const result = await refreshTokenService.searchRefreshToken(tokenToSearch);

      // Assert: Pastikan hasilnya sesuai harapan
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM refresh_tokens WHERE token_hash = $1;', [tokenToSearch]);
      expect(result).toEqual(mockTokenData); // Fungsi harus mengembalikan isi dari `rows`
    });

    test('should return an empty array if token is not found', async () => {
      // Arrange: Atur agar pool.query mengembalikan `rows` kosong
      const mockDbResult = { rows: [] };
      pool.query.mockResolvedValue(mockDbResult);

      const tokenToSearch = 'token-yang-tidak-ada';

      // Act
      const result = await refreshTokenService.searchRefreshToken(tokenToSearch);

      // Assert
      expect(result).toEqual([]); // Harapannya adalah array kosong
    });

    test('should propagate error if pool.query fails', async () => {
        // Arrange: Atur agar pool.query melempar error
        const dbError = new Error('Database query failed');
        pool.query.mockRejectedValue(dbError);

        // Act & Assert: Pastikan error dari database dilempar kembali
        // Ini penting untuk memastikan pemanggil fungsi tahu ada masalah
        await expect(refreshTokenService.searchRefreshToken('any-token')).rejects.toThrow('Database query failed');
    });
  });

  // Anda bisa melanjutkan pola yang sama untuk fungsi-fungsi lainnya (search, delete, update, dll)
  // yang sebagian besar sudah benar karena hanya bergantung pada `pool.query` yang sudah di-mock.
});