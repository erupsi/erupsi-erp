/**
 * @fileoverview Authentication service functions for employee management
 * @module services/authService
 */

const pool = require("./db");
require("dotenv").config({path: __dirname + "/../../../../../.env"});
const requestBuilder = require("../utils/requestBuilder");
const {bcryptSalting} = require("../utils/passwordUtils");

/**
 * Registers a new employee in the authentication system
 * @async
 * @function registerUser
 * @param {string} employeeInitialUuid - Unique identifier for the employee
 * @param {string} username - Employee username
 * @param {string} password - Plain text password
 * @param {Date} passwordExpiry - Password expiration date
 * @return {Promise<Object>} Result object with success status and message
 * @example
 * const result = await registerUser(
 *   "123e4567-e89b-12d3-a456-426614174000",
 *   "john.doe",
 *   "securePassword123",
 *   new Date("2024-12-31")
 * );
 */
const registerUser = async (
    employeeInitialUuid,
    username,
    password,
    passwordExpiry,
) => {
    try {
        const isEmployeeExist = await checkEmployeeByUsername(username);

        if (isEmployeeExist) {
            return {success: false, message: "User Already Defined"};
        }

        const hashedPass = await bcryptSalting(password);

        const query =
          `INSERT INTO auth_employee(employeeId, username,
          password, password_expiry) VALUES($1, $2, $3, $4)`;
        await pool.query(query,
            [employeeInitialUuid, username, hashedPass, passwordExpiry]);
        return {success: true};
    } catch (err) {
        console.error(err);
        return {success: false};
    }
};

/**
 * Retrieves employee data by username from the database
 * @async
 * @function checkEmployeeByUsername
 * @param {string} employeeUsername - The username to search for
 * @return {Promise<Object|false>} Employee data object or false if not found
 * @example
 * const employee = await checkEmployeeByUsername("john.doe");
 * if (employee) {
 *   console.log(employee.employeeid, employee.password);
 * }
 */
const checkEmployeeByUsername = async (employeeUsername) => {
    try {
        const query = "SELECT * FROM auth_employee WHERE username=$1";
        const employeeIdFromQuery = await pool.query(query, [employeeUsername]);
        return employeeIdFromQuery.rows[0];
    } catch (err) {
        return false;
    }
};

/**
 * Sends employee data to URM (User Role Management) service
 * @async
 * @function addEmployeeRequestToUrm
 * @param {string} argEmployeeId - Employee unique identifier
 * @param {string} argFullName - Employee full name
 * @param {string} argEmail - Employee email address
 * @param {string} argDepartment - Employee department
 * @param {string} argPosition - Employee position/job title
 * @param {string} argRoleName - Employee role name
 * @return {Promise<Object>} Response from URM service
 * @throws {Error} If required employee data is missing or request fails
 * @example
 * const result = await addEmployeeRequestToUrm(
 *   "emp123",
 *   "John Doe",
 *   "john@company.com",
 *   "IT",
 *   "Developer",
 *   "USER"
 * );
 */
const addEmployeeRequestToUrm = async (
    argEmployeeId,
    argFullName,
    argEmail,
    argDepartment,
    argPosition,
    argRoleName,
) => {
    try {
        if (!argEmployeeId || !argFullName || !argEmail||
          !argDepartment || ! argPosition || !argRoleName) {
            throw new Error("Employee data is less than required");
        }

        const employeeData = {
            employeeId: argEmployeeId,
            fullName: argFullName,
            email: argEmail,
            department: argDepartment,
            position: argPosition,
            roleName: argRoleName,
        };

        const response = await requestBuilder("http://localhost:3001/urm/employee", "POST", employeeData);

        if (!response.success) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("Error in addEmployeeRequestToUrm:", error);
        throw error;
    }
};

/**
 * Retrieves employee data from URM service by employee ID
 * @async
 * @function getEmployeeDataFromUrm
 * @param {string} employeeId - Employee unique identifier
 * @return {Promise<Object>} Employee data from URM service
 * @example
 * const employeeData = await getEmployeeDataFromUrm("emp123");
 * console.log(employeeData.data.roles);
 */
const getEmployeeDataFromUrm = async (employeeId) => {
    const response = await requestBuilder(`http://localhost:3001/urm/employee/${employeeId}`, "GET");
    return response;
};

/**
 * Retrieves employee username by employee ID
 * @async
 * @function getEmployeeUsername
 * @param {string} employeeId - Employee unique identifier
 * @return {Promise<string|false>} Employee username or false if not found
 * @example
 * const username = await getEmployeeUsername("emp123");
 * if (username) {
 *   console.log("Username:", username);
 * }
 */
const getEmployeeUsername = async (employeeId) => {
    try {
        const query = "SELECT username FROM auth_employee WHERE employeeId=$1";
        const employeeIdFromQuery = await pool.query(query, [employeeId]);
        return employeeIdFromQuery.rows[0].username;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Changes employee password and sets new expiry date
 * @async
 * @function changeEmployeePassword
 * @param {string} username - Employee username
 * @param {string} password - New hashed password
 * @param {Date} expiryDate - New password expiry date
 * @return {Promise<Object>} Result object with success status
 * @example
 * const result = await changeEmployeePassword(
 *   "john.doe",
 *   "$2b$10$hashedPassword...",
 *   new Date("2024-12-31")
 * );
 */
const changeEmployeePassword = async (username, password, expiryDate) => {
    try {
        const sql = `UPDATE auth_employee SET password = $1, 
          password_expiry = $2 WHERE username = $3;`;
        await pool.query(sql, [password, expiryDate, username]);
        return {success: true};
    } catch (error) {
        console.error(error);
        return {success: false};
    }
};

module.exports = {
    changeEmployeePassword,
    getEmployeeUsername,
    registerUser,
    addEmployeeRequestToUrm,
    checkEmployeeByUsername,
    getEmployeeDataFromUrm};
