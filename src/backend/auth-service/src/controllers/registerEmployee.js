/**
 * @fileoverview Employee registration controller
 * @module controllers/registerEmployee
 */

const {v4: uuidv4} = require("uuid");
const {registerUser, addEmployeeRequestToUrm} =
require("../services/authService");

/**
 * Handles employee registration process
 * @async
 * @function registerEmployee
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing employee data
 * @param {string} req.body.username - Employee username
 * @param {string} req.body.password - Employee password
 * @param {string} req.body.fullName - Employee full name
 * @param {string} req.body.email - Employee email address
 * @param {string} req.body.department - Employee department
 * @param {string} req.body.position - Employee position/job title
 * @param {string} req.body.roleName - Employee role name
 * @param {Date} req.body.passwordExpiry - Password expiration date
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {Promise<void>} Sends JSON response with registration result
 * @description
 * Registers a new employee by:
 * 1. Generating unique employee ID
 * 2. Adding employee data to URM service
 * 3. Creating authentication record in auth database
 *
 * @example
 * // Request body
 * {
 *   "username": "john.doe",
 *   "password": "securePassword123",
 *   "fullName": "John Doe",
 *   "email": "john@company.com",
 *   "department": "IT",
 *   "position": "Developer",
 *   "roleName": "USER",
 *   "passwordExpiry": "2024-12-31T23:59:59.000Z"
 * }
 */
const registerEmployee = async (req, res, next) => {
    try {
        const {username, password,
            fullName,
            email, department, position, roleName, passwordExpiry} = req.body;

        const newEmployeeId = uuidv4();
        const addEmployeeData = await addEmployeeRequestToUrm(
            newEmployeeId, fullName, email, department, position, roleName);

        if (!addEmployeeData.success === true) {
            return res.status(400).json({
                error: "Gagal menambahkan data pegawai ke URM"});
        }
        const register = await registerUser(
            newEmployeeId, username, password, passwordExpiry);

        if (!register.success === true) {
            return res.status(400)
                .json({error: "Gagal menambahkan data pegawai ke URM"});
        }

        return res.status(200).json({message: "Pegawai berhasil didaftarkan"});
    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({error: "Terjadi kesalahan internal server."});
    }
};

module.exports = registerEmployee;
