const express = require('express');
const router = express.Router();

const registerEmployee = require('../controllers/registerEmployee')
const authenticateServiceReq = require('../middlewares/authenticateServiceReq')
const validateLoginReq = require('../validationator/validateLoginReq')
const loginEmployee = require('../controllers/loginEmployee');
const refreshTokenRenewal = require('../controllers/refreshTokenRenewal');
const logoutHandler = require('../controllers/logoutHandler');
const validateRegisterReq = require('../validationator/validateRegisterReq');
const employeeChangePassword = require('../controllers/employeeChangePassword');
const validateEmployeeChangePassword = require('../validationator/validateEmployeeChangePassword');
const validateAdminResetPassword = require('../validationator/validateAdminResetPassword');
const adminResetPassword = require('../controllers/adminResetPassword');

router.post("/register", 
  authenticateServiceReq({useRole:true}), 
  validateRegisterReq, 
  registerEmployee
);

router.post("/login",
  // authenticateServiceReq(),
  validateLoginReq(),
  loginEmployee
);

router.post("/refresh-token", 
  authenticateServiceReq(),
  refreshTokenRenewal
);

router.post("/logout",
  authenticateServiceReq(),
  logoutHandler
);

router.post("/change-password",
  authenticateServiceReq(),
  validateEmployeeChangePassword(),
  employeeChangePassword
);

router.post("/reset-password",
  authenticateServiceReq({useRole: true}),
  validateAdminResetPassword(),
  adminResetPassword
);

module.exports = router