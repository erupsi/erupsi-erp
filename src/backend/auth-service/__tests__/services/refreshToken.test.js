// __tests__/services/refreshToken.test.js

// --- [PERUBAHAN KUNCI #1] ---
// Impor seluruh modul sebagai SATU OBJEK.
const refreshTokenService = require("../../src/services/RefreshToken");

// Impor dependensi eksternal yang akan kita mock
const jwt = require("jsonwebtoken");
const pool = require("../../src/services/db"); // Pastikan path ini benar
const crypto = require("crypto");

// Mock semua dependensi eksternal. Ini sudah benar.
jest.mock("jsonwebtoken");
jest.mock("../../src/services/db");
jest.mock("crypto");

const normalizeSQL = (sql) => {
    if (typeof sql !== "string") return sql;
    return sql.replace(/\s+/g, " ").trim();
};

describe("Refresh Token Service", () => {
    const mockEmployeeId = "emp-123";
    const mockUsername = "testuser";
    const mockRoles = ["user"];
    let mockResponse;

    beforeEach(() => {
    // Membersihkan semua mock sebelum setiap tes berjalan
        jest.clearAllMocks();

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Siapkan mock return value default untuk dependensi
        jwt.sign.mockReturnValue("mock-access-token");
        crypto.randomBytes.mockReturnValue({
            toString: jest.fn().mockReturnValue("mock-refresh-token-hex"),
        });
    });

    // --- [PERUBAHAN KUNCI #2] ---
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // --- Test suite for tokenBuilderAssigner ---
    describe("tokenBuilderAssigner", () => {
        test(`should return accessToken and refreshToken
          without replacing if options.replace_token is false`, async () => {
            // --- [PERUBAHAN KUNCI #3] ---
            // Buat spy pada method di objek refreshTokenService
            const replaceSpy = jest
                .spyOn(refreshTokenService, "replaceRefreshTokenFromDB");

            // Panggil fungsi sebagai method dari objek refreshTokenService
            const result = await refreshTokenService
                .tokenBuilderAssigner(mockResponse,
                    mockEmployeeId, mockUsername, mockRoles);

            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(crypto.randomBytes).toHaveBeenCalledTimes(1);

            expect(replaceSpy).not.toHaveBeenCalled();

            expect(result).toEqual({
                accessToken: "mock-access-token",
                refreshToken: "mock-refresh-token-hex",
            });
        });

        test("should replace token in DB if options.replace_token is true",
            async () => {
            // Buat spy dan mock implementasinya agar berhasil
                const replaceSpy = jest
                    .spyOn(refreshTokenService, "replaceRefreshTokenFromDB")
                    .mockResolvedValue(true);

                const result = await refreshTokenService
                    .tokenBuilderAssigner(mockResponse,
                        mockEmployeeId, mockUsername, mockRoles,
                        {replace_token: true});

                // Sekarang assertion ini akan BENAR
                expect(replaceSpy).toHaveBeenCalledTimes(1);
                expect(replaceSpy)
                    .toHaveBeenCalledWith(mockEmployeeId,
                        "mock-refresh-token-hex", expect.any(Date));

                expect(result).toEqual({
                    accessToken: "mock-access-token",
                    refreshToken: "mock-refresh-token-hex",
                });
            });

        test("should return 500 status if replaceRefreshTokenFromDB fails",
            async () => {
            // Buat spy dan mock implementasinya agar gagal
                const replaceSpy = jest
                    .spyOn(refreshTokenService, "replaceRefreshTokenFromDB")
                    .mockResolvedValue(false);

                await refreshTokenService
                    .tokenBuilderAssigner(mockResponse,
                        mockEmployeeId, mockUsername, mockRoles,
                        {replace_token: true});

                // Sekarang assertion ini akan BENAR
                expect(replaceSpy).toHaveBeenCalledTimes(1);
                expect(mockResponse.status).toHaveBeenCalledWith(500);
            });
        test("should return 500 status if jwt.sign throws an error",
            async () => {
            // Atur agar jwt.sign melempar error
                const signError = new Error("JWT signing failed");
                jwt.sign.mockImplementation(() => {
                    throw signError;
                });

                await refreshTokenService
                    .tokenBuilderAssigner(mockResponse,
                        mockEmployeeId, mockUsername, mockRoles);

                // Pastikan blok catch terpanggil dan mengirim status 500
                expect(mockResponse.status).toHaveBeenCalledWith(500);
                expect(mockResponse.json)
                    .toHaveBeenCalledWith({error: "Internal Server Error"});
            });
    });


    describe("replaceRefreshTokenFromDB", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("should delete old token and insert new one in correct order",
            async () => {
            // 1. ARRANGE
                const mockEmployeeId = "emp-123";
                const mockNewToken = "new-token";
                const mockExpiresAt = new Date();
                const mockExpiresAtISOString = mockExpiresAt.toISOString();

                // Beritahu mock agar selalu berhasil untuk tes happy path ini
                pool.query.mockResolvedValue();

                // 2. ACT
                await refreshTokenService.replaceRefreshTokenFromDB(
                    mockEmployeeId,
                    mockNewToken,
                    mockExpiresAtISOString,
                );

                // 3. ASSERT
                // Pastikan ada total 2 panggilan ke pool.query
                expect(pool.query).toHaveBeenCalledTimes(2);

                // Verifikasi panggilan PERTAMA (DELETE)
                expect(pool.query).toHaveBeenNthCalledWith(
                    1, // Panggilan ke-1
                    expect.stringContaining("DELETE FROM refresh_tokens"),
                    [mockEmployeeId],
                );

                // Verifikasi panggilan KEDUA (INSERT)
                expect(pool.query).toHaveBeenNthCalledWith(
                    2, // Panggilan ke-2
                    expect.stringContaining("INSERT INTO refresh_tokens"),
                    [
                        mockNewToken,
                        mockEmployeeId,
                        mockExpiresAtISOString,
                    ],
                );
            });

        test("should return false on database error", async () => {
            // ARRANGE
            pool.query.mockRejectedValue(new Error("DB connection failed"));

            // ACT
            const result = await refreshTokenService
                .replaceRefreshTokenFromDB("id", "token", new Date());

            // ASSERT
            expect(result).toBe(false);
            expect(pool.query).not.toHaveBeenCalledWith("ROLLBACK");
        });
    });

    describe("invalidateToken", () => {
        beforeEach(() => {
            // Membersihkan mock antar tes agar tidak bocor
            jest.clearAllMocks();
        });

        // =======================================================
        // == TES SKENARIO SUKSES (HAPPY PATH) YANG DIPERBAIKI ==
        // =======================================================
        test("should call pool.query with correct query", async () => {
            const tokenIdToInvalidate = 1;
            pool.query.mockResolvedValue();

            // Beritahu mock agar berhasil
            pool.query.mockResolvedValue();

            // ACT
            await refreshTokenService
                .invalidateToken(tokenIdToInvalidate);

            // ASSERT
            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE refresh_tokens"),
                [tokenIdToInvalidate],
            );
        });


        // =====================================================
        // == TES SKENARIO GAGAL (ERROR PATH) YANG DIPERBAIKI ==
        // =====================================================
    });

    describe("insertToken", () => {
        test("should call pool.query with correct query", async () => {
        // 1. ARRANGE
        // Definisikan setiap argumen sebagai variabel terpisah untuk kejelasan
            const refreshToken = "new-token";
            const employeeId = "emp-123";
            const dummyExpiresAt = new Date().toISOString();

            const expectedQuery = `
            INSERT INTO refresh_tokens 
            (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)
        `;
            const expectedParams = [
                refreshToken,
                employeeId,
                expect.any(String),
            ];

            // 2. ACT
            // =======================================================
            // == PERBAIKI CARA PEMANGGILAN FUNGSI DI SINI ==
            // Berikan tiga argumen terpisah, BUKAN satu objek.
            await refreshTokenService.insertToken(
                refreshToken,
                employeeId,
                dummyExpiresAt,
            );
            // =======================================================

            // 3. ASSERT
            const receivedQuery = pool.query.mock.calls[0][0];
            const receivedParams = pool.query.mock.calls[0][1];

            expect(normalizeSQL(receivedQuery))
                .toEqual(normalizeSQL(expectedQuery));

            // Sekarang `receivedParams` akan cocok dengan `expectedParams`
            expect(receivedParams).toEqual(expectedParams);


            // pool.query.mockResolvedValue({});
            // const expiryDate = new Date();
            // await refreshTokenService
            //     .insertToken("new-token", mockEmployeeId, expiryDate);
            // expect(pool.query).toHaveBeenCalledWith(
            //     `INSERT INTO refresh_tokens
            //     (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)`,
            //     ["new-token", mockEmployeeId, expiryDate],
            // );
        });
        test("should throw an error on database failure", async () => {
            // ARRANGE
            const dbError = new Error("DB error");
            const refreshToken = "test-token";
            const employeeId = "emp-test";
            const expiresAt = new Date();

            pool.query.mockRejectedValue(dbError);


            // ACT & ASSERT
            // Pastikan fungsi ini melempar kembali error yang kita buat
            await expect(
                refreshTokenService
                    .insertToken(refreshToken, employeeId, expiresAt),
            ).rejects.toThrow(dbError);
        });
    });

    // --- Test suite for invalidateAndInsertToken ---
    describe("invalidateAndInsertToken", () => {
        beforeEach(() => {
        // Membersihkan semua histori panggilan mock sebelum setiap tes
            jest.clearAllMocks();
        });

        afterEach(() => {
            // Mengembalikan fungsi yang di-spy ke implementasi aslinya
            jest.restoreAllMocks();
        });
        const mockTokenId = 1;
        const mockNewRefreshToken = "new-refresh-token";
        const mockNewExpiry = new Date();

        test("should invalidate and insert token and commit transaction",
            async () => {
            // Buat spy untuk fungsi internal yang dipanggil
                const invalidateSpy = jest
                    .spyOn(refreshTokenService, "invalidateToken")
                    .mockResolvedValue();
                const insertSpy = jest
                    .spyOn(refreshTokenService, "insertToken")
                    .mockResolvedValue();

                // Mock pool.query untuk transaksi
                pool.query.mockResolvedValue({});

                await refreshTokenService
                    .invalidateAndInsertToken(
                        mockTokenId,
                        mockNewRefreshToken, mockEmployeeId, mockNewExpiry);
                // Sekarang assertion ini akan BENAR
                expect(pool.query).toHaveBeenCalledWith("BEGIN");
                expect(invalidateSpy).toHaveBeenCalledWith(mockTokenId);
                expect(insertSpy)
                    .toHaveBeenCalledWith(
                        mockNewRefreshToken,
                        mockEmployeeId,
                        mockNewExpiry);
                expect(pool.query).toHaveBeenCalledWith("COMMIT");
                expect(pool.query).not.toHaveBeenCalledWith("ROLLBACK");
            });

        test("should rollback transaction on error", async () => {
            // ARRANGE: Siapkan mock dan simulasi error
            const mockError = new Error("Gagal memasukkan token baru");

            const invalidateTokenSpy = jest
                .spyOn(refreshTokenService, "invalidateToken")
                .mockResolvedValue(); // Asumsikan invalidateToken berhasil

            const insertTokenSpy =
            jest.spyOn(refreshTokenService, "insertToken")
                .mockRejectedValue(mockError); // <<< BUAT insertToken GAGAL

            // ACT & ASSERT: Panggil service dan pastikan ia melempar error
            await expect(
                refreshTokenService.invalidateAndInsertToken(
                    1,
                    "new-refresh-token",
                    "emp-123",
                    new Date(),
                ),
            ).rejects.toThrow(mockError);

            // ASSERT FINAL: Pastikan `pool.query` dipanggil dengan benar
            expect(pool.query).toHaveBeenCalledWith("BEGIN");

            // Pastikan 'ROLLBACK' dipanggil. Ini akan berhasil sekarang.
            expect(pool.query).toHaveBeenCalledWith("ROLLBACK");

            // Pastikan 'COMMIT' TIDAK dipanggil
            expect(pool.query).not.toHaveBeenCalledWith("COMMIT");

            // Pastikan juga fungsi-fungsi internal dipanggil
            expect(invalidateTokenSpy).toHaveBeenCalledWith(1);
            expect(insertTokenSpy).toHaveBeenCalled();
        });
        test("should rollback transaction on error", async () => {
            // 3. ARRANGE: Siapkan simulasi error
            const mockDatabaseError =
            new Error("Gagal karena koneksi database terputus");

            // 4. Gunakan `jest.spyOn` pada objek service yang diimpor
            // Buat `invalidateToken` berhasil
            jest.spyOn(refreshTokenService, "invalidateToken")
                .mockResolvedValue();

            // Buat `insertToken` GAGAL dengan melempar error yang kita siapkan
            jest.spyOn(refreshTokenService, "insertToken")
                .mockRejectedValue(mockDatabaseError);

            // 5. ACT & ASSERT: Panggil fungsi dan pastikan promise-nya REJECT
            await expect(
                refreshTokenService.invalidateAndInsertToken(
                    1,
                    "new-refresh-token",
                    "emp-123",
                    new Date(),
                ),
            ).rejects.toThrow(mockDatabaseError);

            // 6. ASSERT FINAL: Verifikasi panggilan ke `pool.query`
            // Sekarang, karena `insertToken` gagal, blok `catch` akan berjalan.
            expect(pool.query).toHaveBeenCalledWith("BEGIN");
            expect(pool.query).toHaveBeenCalledWith("ROLLBACK");
            expect(pool.query).not.toHaveBeenCalledWith("COMMIT");
        });
    });

    describe("deleteToken", () => {
        test("should call pool.query with correct query to delete a token",
            async () => {
                pool.query.mockResolvedValue({}); // Asumsikan query berhasil

                const tokenToDelete = "token-to-delete-123";
                await refreshTokenService.deleteToken(tokenToDelete);

                expect(pool.query).toHaveBeenCalledTimes(1);
                expect.stringContaining(`DELETE FROM refresh_tokens
                    WHERE token_hash = $1`,
                [tokenToDelete]);
            });
    });

    describe("updateToken", () => {
        test("should call pool.query with correct query to update a token",
            async () => {
                pool.query.mockResolvedValue({});
                const newExpiry = new Date();
                const newToken = "new-updated-token";

                await refreshTokenService
                    .updateToken(mockEmployeeId, newToken, newExpiry);

                expect(pool.query).toHaveBeenCalledTimes(1);
                expect.stringContaining(
                    `UPDATE refresh_tokens SET token_hash = $1,
        expires_at = $2 WHERE employee_id = $3`,
                    [newToken, newExpiry, mockEmployeeId],
                );
            });
    });

    describe("deleteTokenByEmpId", () => {
        test(
            `should call pool.query with
          correct query to delete tokens by employee ID`,
            async () => {
                pool.query.mockResolvedValue({});

                await refreshTokenService.deleteTokenByEmpId(mockEmployeeId);

                expect(pool.query).toHaveBeenCalledTimes(1);
                expect(pool.query).toHaveBeenCalledWith(
                    "DELETE FROM refresh_tokens WHERE employee_id = $1",
                    [mockEmployeeId]);
            });
    });
    // --- Test suite for searchRefreshToken ---
    describe("searchRefreshToken", () => {
        test("should return token data if found in database", async () => {
            // Arrange: Siapkan data palsu seolah-olah dari database
            const mockTokenData = [{
                id: 1,
                token_hash: "token-yang-ada-di-db",
                employee_id: "emp-123",
                is_valid: true,
                expires_at: "2025-12-31T23:59:59Z",
            }];
            const mockDbResult = {rows: mockTokenData};

            // Atur agar pool.query mengembalikan data palsu kita
            pool.query.mockResolvedValue(mockDbResult);

            const tokenToSearch = "token-yang-ada-di-db";

            // Act: Panggil fungsi yang diuji
            const result =
            await refreshTokenService.searchRefreshToken(tokenToSearch);

            // Assert: Pastikan hasilnya sesuai harapan
            expect(pool.query).toHaveBeenCalledTimes(1);
            expect(pool.query).toHaveBeenCalledWith(
                "SELECT * FROM refresh_tokens WHERE token_hash = $1;",
                [tokenToSearch]);
            expect(result).toEqual(mockTokenData);
        });

        test("should return an empty array if token is not found", async () => {
            // Arrange: Atur agar pool.query mengembalikan `rows` kosong
            const mockDbResult = {rows: []};
            pool.query.mockResolvedValue(mockDbResult);

            const tokenToSearch = "token-yang-tidak-ada";

            // Act
            const result =
            await refreshTokenService.searchRefreshToken(tokenToSearch);

            // Assert
            expect(result).toEqual([]); // Harapannya adalah array kosong
        });

        test("should propagate error if pool.query fails", async () => {
        // Arrange: Atur agar pool.query melempar error
            const dbError = new Error("Database query failed");
            pool.query.mockRejectedValue(dbError);

            // Act & Assert: Pastikan error dari database dilempar kembali
            // Ini penting untuk memastikan pemanggil fungsi tahu ada masalah
            await expect(refreshTokenService
                .searchRefreshToken("any-token"))
                .rejects.toThrow("Database query failed");
        });
    });
});
