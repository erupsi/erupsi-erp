const {bcryptSalting, comparator} = require("../../src/utils/passwordUtils");

// __tests__/utils/passwordUtils.test.js

// Impor fungsi yang akan kita uji

// Impor modul 'bcrypt' agar kita bisa mengakses mock-nya
const bcrypt = require("bcrypt");

// 1. Mock seluruh modul 'bcrypt'
jest.mock("bcrypt");

describe("Password Utils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===============================================
    // Tes untuk fungsi bcryptSalting
    // ===============================================
    describe("bcryptSalting", () => {
        const plainPassword = "password123";

        test("should return a hashed password on successful salting",
            async () => {
            // Arrange: Siapkan apa yang akan dikembalikan oleh mock kita
                const mockedHash = "hashed_password_from_bcrypt";
                bcrypt.hash.mockResolvedValue(mockedHash);

                // Act: Panggil fungsi yang sedang diuji
                const result = await bcryptSalting(plainPassword);

                // Assert: Periksa apakah semuanya berjalan sesuai harapan
                // 1. Pastikan bcrypt.hash dipanggil dengan benar
                expect(bcrypt.hash).toHaveBeenCalledTimes(1);
                expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);

                // 2. Pastikan fungsi kita mengembalikan hash dari bcrypt
                expect(result).toBe(mockedHash);
            });

        test("should return undefined when bcrypt.hash throws an error",
            async () => {
                // Arrange: Atur agar mock bcrypt.hash melempar error
                const hashingError = new Error(
                    "Something went wrong during hashing");
                bcrypt.hash.mockRejectedValue(hashingError);

                // Act
                const result = await bcryptSalting(plainPassword);

                expect(bcrypt.hash).toHaveBeenCalledTimes(1);
                expect(result).toBeUndefined();
            });
    });

    // ===============================================
    // Tes untuk fungsi comparator
    // ===============================================
    describe("comparator", () => {
        const plainPassword = "password123";
        const hashedPassword = "hashed_password_from_db";

        test("should return true when passwords match", async () => {
            // Arrange: Atur agar bcrypt.compare mengembalikan true (cocok)
            bcrypt.compare.mockResolvedValue(true);

            // Act
            const isMatch = await comparator(plainPassword, hashedPassword);

            // Assert
            expect(bcrypt.compare).toHaveBeenCalledTimes(1);
            expect(bcrypt.compare)
                .toHaveBeenCalledWith(plainPassword, hashedPassword);
            expect(isMatch).toBe(true);
        });

        test("should return false when passwords do not match", async () => {
            bcrypt.compare.mockResolvedValue(false);

            // Act
            const isMatch = await comparator(plainPassword, hashedPassword);

            // Assert
            expect(bcrypt.compare).toHaveBeenCalledTimes(1);
            expect(isMatch).toBe(false);
        });

        test("should return false and log an error when bcrypt.compare fails",
            async () => {
            // Arrange: Atur agar bcrypt.compare melempar error
                const compareError = new Error("Invalid hash format");
                bcrypt.compare.mockRejectedValue(compareError);

                const consoleSpy = jest.spyOn(console, "error")
                    .mockImplementation(() => {});

                // Act
                const isMatch = await comparator(plainPassword, hashedPassword);

                // Assert
                // 1. Hasilnya harus false sesuai blok catch
                expect(isMatch).toBe(false);

                // 2. Pastikan error dicatat ke konsol
                expect(consoleSpy).toHaveBeenCalledTimes(1);
                expect(consoleSpy).toHaveBeenCalledWith(compareError);

                // 3. Kembalikan fungsi console.error ke kondisi semula
                consoleSpy.mockRestore();
            });
    });
});
