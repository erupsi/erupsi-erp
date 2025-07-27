const express = require('express');
const router = express.Router();
const getAllEmployee = require('../controllers/getAllEmployee')
const createEmployee = require('../controllers/createEmployee')
const getEmployeeDetail = require('../controllers/getEmployeeDetail')
const editEmployeeDetails = require('../controllers/editEmployeeDetails')
const deleteEmployee = require('../controllers/deleteEmployee')
const assignRoleToEmployee = require('../controllers/assignRoleToEmployee')
const getAllRoles = require('../controllers/getAllRoles')
const addRole = require('../controllers/addRole')
const patchBodyValidator = require('../middlewares/patchBodyValidator')
const patchRoleUpdateValidator = require('../middlewares/patchRoleUpdateValidator')
const validateRoleCreationReq = require('../middlewares/validateRoleCreationReq')
const authenticateServiceRequest = require('../middlewares/authenticateServiceRequest');
const validateEmployeeIdOnParam = require('../middlewares/validateEmployeeIdOnParam');

//get all employee
router.get(
  "/employee", 
  authenticateServiceRequest({useRole: true}), 
  getAllEmployee);

//create employee 
router.post(
  "/employee", 
  authenticateServiceRequest(), 
  createEmployee);

//get employee based on id 
router.get(
  "/employee/:employeeId", 
  authenticateServiceRequest(),
  validateEmployeeIdOnParam, 
  getEmployeeDetail)

//edit employee partially based on req body  
router.patch(
  "/employee/:employeeId", 
  authenticateServiceRequest({useRole: true}), 
  patchBodyValidator(), 
  validateEmployeeIdOnParam,
  editEmployeeDetails)

//delete employee based on employeeId
router.delete(
  "/employee/:employeeId", 
  authenticateServiceRequest({useRole: true}), 
  validateEmployeeIdOnParam,
  deleteEmployee)

//change employee role
router.put(
  "/employee/:employeeId/roles",
  authenticateServiceRequest({useRole: true}),
  patchRoleUpdateValidator(),
  validateEmployeeIdOnParam,
  assignRoleToEmployee)

//get all roles
router.get(
  "/roles", 
  authenticateServiceRequest(), 
  getAllRoles)

//add roles 
router.post(
  "/roles", 
  authenticateServiceRequest({useRole: true}), 
  validateRoleCreationReq(),
  addRole)

module.exports = router;