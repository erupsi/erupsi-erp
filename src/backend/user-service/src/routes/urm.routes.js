const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const getAllEmployee = require("../controllers/getAllEmployee");
const createEmployee = require("../controllers/createEmployee");
const getEmployeeDetail = require("../controllers/getEmployeeDetail");
const editEmployeeDetails = require("../controllers/editEmployeeDetails");
const deleteEmployee = require("../controllers/deleteEmployee");
const assignRoleToEmployee = require("../controllers/assignRoleToEmployee");
const getAllRoles = require("../controllers/getAllRoles");
const addRole = require("../controllers/addRole");
const patchBodyValidator = require("../middlewares/patchBodyValidator");
const patchRoleUpdateValidator = require("../middlewares/patchRoleUpdateValidator");
const validateRoleCreationReq = require("../middlewares/validateRoleCreationReq");
const authenticateServiceRequest = require("../middlewares/authenticateServiceRequest");
const validateEmployeeIdOnParam = require("../middlewares/validateEmployeeIdOnParam");

/**
 * @module Routes/URM
 * @description Defines routes for user and role management (URM) operations.
 */

/**
 * @route GET /employee
 * @description Retrieves a list of all employees.
 * @access Protected (requires authentication and role-based access)
 */
router.get(
    "/employee",
    authenticateServiceRequest({AdminRole: true}),
    getAllEmployee);


/**
 * @route POST /employee
 * @description Creates a new employee.
 * @access Protected (requires authentication)
 */
router.post(
    "/employee",
    authenticateServiceRequest({AuthService: true}),
    createEmployee);


/**
 * @route POST /employee/get-employee
 * @description Retrieves details of a specific employee by their ID.
 * @access Protected (requires authentication)
 */
router.post(
    "/employee/get-employee",
    authenticateServiceRequest({AdminRole: true, AuthService: true}),
    validateEmployeeIdOnParam,
    getEmployeeDetail);


/**
 * @route PATCH /employee/:employeeId
 * @description Partially updates an employee's details based on the request body.
 * @access Protected (requires authentication and role-based access)
 */
router.patch(
    "/employee/:employeeId",
    authenticateServiceRequest({AdminRole: true}),
    patchBodyValidator(),
    validateEmployeeIdOnParam,
    editEmployeeDetails);


/**
 * @route DELETE /employee/:employeeId
 * @description Deletes an employee based on their ID.
 * @access Protected (requires authentication and role-based access)
 */
router.delete(
    "/employee/:employeeId",
    authenticateServiceRequest({AdminRole: true}),
    validateEmployeeIdOnParam,
    deleteEmployee);


/**
 * @route PUT /employee/:employeeId/roles
 * @description Updates the roles assigned to a specific employee.
 * @access Protected (requires authentication and role-based access)
 */
router.put(
    "/employee/:employeeId/roles",
    authenticateServiceRequest({AdminRole: true}),
    patchRoleUpdateValidator(),
    validateEmployeeIdOnParam,
    assignRoleToEmployee);


/**
 * @route GET /roles
 * @description Retrieves a list of all roles.
 * @access Protected (requires authentication)
 */
router.get(
    "/roles",
    authenticateServiceRequest({AdminRole: true}),
    getAllRoles);


/**
 * @route POST /roles
 * @description Adds a new role to the system.
 * @access Protected (requires authentication and role-based access)
 */
router.post(
    "/roles",
    authenticateServiceRequest({AdminRole: true}),
    validateRoleCreationReq(),
    addRole);

module.exports = router;
