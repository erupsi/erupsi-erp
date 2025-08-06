/**
 * @fileoverview Employee login controller
 * @module controllers/loginEmployee
 */

const {comparator} = require("../utils/passwordUtils");
const {checkEmployeeByUsername,
    getEmployeeDataFromUrm} = require("../services/authService");
const {tokenBuilderAssigner} = require("../services/RefreshToken");

/**
 * Handles employee login authentication
 * @async
 * @function loginEmployee
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.username - Employee username
 * @param {string} req.body.password - Employee password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<void>} Sends JSON response with login result
 * @description
 * Authenticates employee login by:
 * 1. Validating username and password
 * 2. Checking password expiry status
 * 3. Generating access and refresh tokens
 * 4. Setting secure HTTP-only cookie for refresh token
 *
 * @example
 * // Request body
 * {
 *   "username": "john.doe",
 *   "password": "securePassword123"
 * }
 *
 * // Success response
 * {
 *   "message": "Login successful",
 *   "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "passwordExpiryWarning": "Your password will expire in 2 days..."
 * }
 */
const loginEmployee = async (req, res, next) =>{
    try {
        const {username, password} = req.body;
        const employeeData = await checkEmployeeByUsername(username);

        if (!employeeData) {
            return res.status(401).json({
                error: "Invalid username or password"});
        }

        const employeeId = employeeData.employeeid;
        const hashedPass = employeeData.password;
        const isPasswordMatch = await comparator(password, hashedPass);

        if (!isPasswordMatch) {
            return res.status(401).json({
                error: "Invalid username or password"});
        }

        const employeeFromUrm = await getEmployeeDataFromUrm(
            employeeData.employeeid);
        const employeeRole = employeeFromUrm.data.roles;

        const {refreshToken, accessToken} = await tokenBuilderAssigner(
            res, employeeId, username, employeeRole, {replace_token: true});

        const responseBody = {
            message: "Login successful",
            accessToken: accessToken,
        };

        const passwordExpiry = employeeData.password_expiry;
        const currentDate = new Date();

        const timeLeft = passwordExpiry - currentDate;
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

        if (daysLeft <= 3 && daysLeft > 0) {
            responseBody.passwordExpiryWarning =
      `Your password will expire in ${daysLeft} days. Please change it soon.`;
        }

        if (daysLeft <= 0) {
            responseBody.passwordExpired =
      "Password expired. Change it now";
        }

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 8 * 60 * 60 * 1000,
            })
            .json(responseBody);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error At Login Employee"});
    }
};

module.exports = loginEmployee;
