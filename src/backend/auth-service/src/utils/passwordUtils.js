/**
 * @fileoverview Password utility functions for hashing and comparing passwords
 * @module utils/passwordUtils
 */

const bcrypt = require("bcrypt");

/**
 * Hashes a plain text password using bcrypt with salt rounds
 * @async
 * @function bcryptSalting
 * @param {string} plainPassword - The plain text password to hash
 * @return {Promise<string|undefined>} The hashed password or undefined if
 * error occurs
 * @example
 * const hashedPassword = await bcryptSalting("myPassword123");
 * console.log(hashedPassword); // $2b$10$...
 */
const bcryptSalting = async (plainPassword) => {
    try {
        const saltRounds = 10;
        const storedHash = await bcrypt.hash(plainPassword, saltRounds);
        return storedHash;
    } catch (error) {
        return;
    }
};

/**
 * Compares a plain text password with a hashed password
 * @async
 * @function comparator
 * @param {string} plainPassword - The plain text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @return {Promise<boolean>} True if passwords match, false otherwise
 * @example
 * const isMatch = await comparator("myPassword123", "$2b$10$...");
 * console.log(isMatch); // true or false
 */
const comparator = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {bcryptSalting, comparator};
