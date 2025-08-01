const express = require('express');
const router = express.Router();

const registerEmployee = require('../controllers/registerEmployee')
const authenticateServiceReq = require('../middlewares/authenticateServiceReq')
const validateRegisterEmployeeReqBody = require('../validationator/validateRegisterEmployee')
const validateLoginReq = require('../validationator/validateLoginReq')
const loginEmployee = require('../controllers/loginEmployee');
const refreshTokenRenewal = require('../controllers/refreshTokenRenewal');
const logoutHandler = require('../controllers/logoutHandler');

router.post("/register", 
  authenticateServiceReq({useRole:true}), 
  validateRegisterEmployeeReqBody, 
  registerEmployee);

router.post("/login",
  // authenticateServiceReq(),
  validateLoginReq(),
  loginEmployee)

router.post("/refresh-token", 
  authenticateServiceReq(),
  refreshTokenRenewal)

router.post("/logout",
  authenticateServiceReq(),
  logoutHandler
)
module.exports = router