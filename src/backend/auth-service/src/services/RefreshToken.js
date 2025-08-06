/**
 * @fileoverview Refresh token management service
 * @module services/RefreshToken
 */

const jwt = require("jsonwebtoken");
const pool = require("./db");
const crypto = require("crypto");
require("dotenv").config({path: __dirname + "/../../.env"});

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\n/g, "\n");

/**
 * Generates access and refresh tokens for employee authentication
 * @async
 * @function tokenBuilderAssigner
 * @param {Object} res - Express response object (for potential error responses)
 * @param {string} employeeId - Employee unique identifier
 * @param {string} username - Employee username
 * @param {Array<string>} roles - Employee roles array
 * @param {Object} [options={replace_token: false}] - Configuration options
 * @param {boolean} [options.replace_token=false] - Whether to replace existing
 * refresh token in database
 * @return {Promise<Object>} Object containing accessToken and refreshToken
 * @throws {Error} If token generation or database operation fails
 * @example
 * const tokens = await tokenBuilderAssigner(
 *   res,
 *   "emp123",
 *   "john.doe",
 *   ["USER", "ADMIN"],
 *   {replace_token: true}
 * );
 * console.log(tokens.accessToken, tokens.refreshToken);
 */
const tokenBuilderAssigner = async (
    res,
    employeeId,
    username,
    roles,
    options = {replace_token: false},
) => {
    try {
        const accessToken = jwt.sign(
            {employeeId, username, roles},
            PRIVATE_KEY,
            {
                algorithm: "RS256",
                expiresIn: "15m",
                issuer: "auth-service",
            },
        );

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 8);

        const refreshToken = crypto.randomBytes(64).toString("hex");

        if (options.replace_token === true) {
            const replaceResult = await module
                .exports.replaceRefreshTokenFromDB(
                    employeeId,
                    refreshToken,
                    expiryDate,
                );

            if (!replaceResult) {
                return res.status(500).json("Internal Server Error");
            }
        }

        return {accessToken, refreshToken};
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error"});
    }
};

/**
 * Replaces existing refresh token for an employee in the database
 * @async
 * @function replaceRefreshTokenFromDB
 * @param {string} employeeId - Employee unique identifier
 * @param {string} refreshToken - New refresh token to store
 * @param {Date} expiresAt - Token expiration date
 * @return {Promise<boolean>} True if successful, false if failed
 * @example
 * const success = await replaceRefreshTokenFromDB(
 *   "emp123",
 *   "newToken123",
 *   new Date("2024-12-31")
 * );
 */
const replaceRefreshTokenFromDB = async (
    employeeId,
    refreshToken,
    expiresAt,
) => {
    try {
        await pool.query(
            "DELETE FROM refresh_tokens WHERE employee_id = $1;",
            [employeeId],
        );

        await pool.query(
            `INSERT INTO refresh_tokens
            (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)`,
            [refreshToken, employeeId, expiresAt],
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

/**
 * Searches for refresh token in the database
 * @async
 * @function searchRefreshToken
 * @param {string} refreshToken - Token to search for
 * @return {Promise<Array>} Array of matching token records
 * @example
 * const tokens = await searchRefreshToken("tokenHash123");
 * if (tokens.length > 0) {
 *   console.log("Token found:", tokens[0]);
 * }
 */
const searchRefreshToken = async (refreshToken) => {
    const sql = "SELECT * FROM refresh_tokens WHERE token_hash = $1;";
    const result = await pool.query(sql, [refreshToken]);
    return result.rows;
};

/**
 * Deletes a refresh token from the database by token hash
 * @async
 * @function deleteToken
 * @param {string} token - Token hash to delete
 * @return {Promise<void>}
 * @example
 * await deleteToken("tokenHash123");
 */
const deleteToken = async (token) => {
    await pool.query(
        "DELETE FROM refresh_tokens WHERE token_hash = $1",
        [token],
    );
};

/**
 * Updates refresh token and expiry for an employee
 * @async
 * @function updateToken
 * @param {string} employeeId - Employee unique identifier
 * @param {string} refreshToken - New refresh token
 * @param {Date} expiry - New expiration date
 * @return {Promise<void>}
 * @example
 * await updateToken("emp123", "newToken", new Date("2024-12-31"));
 */
const updateToken = async (
    employeeId,
    refreshToken,
    expiry,
) => {
    await pool.query(
        `UPDATE refresh_tokens SET token_hash = $1, 
        expires_at = $2 WHERE employee_id = $3`,
        [refreshToken, expiry, employeeId],
    );
};

/**
 * Marks a refresh token as invalid by token ID
 * @async
 * @function invalidateToken
 * @param {number} tokenId - Token ID to invalidate
 * @return {Promise<void>}
 * @throws {Error} If database operation fails
 * @example
 * await invalidateToken(123);
 */
const invalidateToken = async (tokenId) => {
    try {
        await pool.query(
            "UPDATE refresh_tokens SET is_valid = FALSE WHERE id = $1",
            [tokenId],
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Deletes all refresh tokens for a specific employee
 * @async
 * @function deleteTokenByEmpId
 * @param {string} employeeId - Employee unique identifier
 * @return {Promise<void>}
 * @example
 * await deleteTokenByEmpId("emp123");
 */
const deleteTokenByEmpId = async (employeeId) => {
    await pool.query(
        "DELETE FROM refresh_tokens WHERE employee_id = $1",
        [employeeId],
    );
};

/**
 * Inserts a new refresh token into the database
 * @async
 * @function insertToken
 * @param {string} refreshToken - Token hash to insert
 * @param {string} employeeId - Employee unique identifier
 * @param {Date} expiresAt - Token expiration date
 * @return {Promise<void>}
 * @throws {Error} If database insertion fails
 * @example
 * await insertToken("tokenHash", "emp123", new Date("2024-12-31"));
 */
const insertToken = async (
    refreshToken,
    employeeId,
    expiresAt,
) => {
    try {
        await pool.query(
            `INSERT INTO refresh_tokens 
            (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)`,
            [refreshToken, employeeId, expiresAt],
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * Invalidates old token and inserts new token in a transaction
 * @async
 * @function invalidateAndInsertToken
 * @param {number} tokenId - ID of token to invalidate
 * @param {string} refreshToken - New refresh token to insert
 * @param {string} employeeId - Employee unique identifier
 * @param {Date} expiresAt - Token expiration date
 * @return {Promise<void>}
 * @throws {Error} If transaction fails (triggers rollback)
 * @example
 * await invalidateAndInsertToken(
 *   123,
 *   "newToken",
 *   "emp123",
 *   new Date("2024-12-31")
 * );
 */
const invalidateAndInsertToken = async (
    tokenId,
    refreshToken,
    employeeId,
    expiresAt,
) => {
    await pool.query("BEGIN");
    try {
        await module.exports.invalidateToken(tokenId);
        await module.exports.insertToken(refreshToken, employeeId, expiresAt);
        await pool.query("COMMIT");
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error(error);
        throw error;
    }
};

module.exports = {
    invalidateAndInsertToken,
    insertToken,
    invalidateToken,
    deleteTokenByEmpId,
    updateToken,
    deleteToken,
    tokenBuilderAssigner,
    replaceRefreshTokenFromDB,
    searchRefreshToken,
};
