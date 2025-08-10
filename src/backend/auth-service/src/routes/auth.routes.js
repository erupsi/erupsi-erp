const express = require("express");
/* eslint-disable new-cap */
const router = express.Router();
/* eslint-enable new-cap */
// const {
//     // csrfHandler,
//     csrfProtection,
// } =
// require("../middlewares/csrfProtect");
const csrf = require("csurf");

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: true, // WAJIB karena kita pakai HTTPS dan SameSite=None
        sameSite: "none", // WAJIB untuk mengizinkan cross-origin
    },
});

// router.use(csrfProtection);

const registerEmployee = require("../controllers/registerEmployee");
const authenticateServiceReq = require("../middlewares/authenticateServiceReq");
const validateLoginReq = require("../validationator/validateLoginReq");
const loginEmployee = require("../controllers/loginEmployee");
const refreshTokenRenewal = require("../controllers/refreshTokenRenewal");
const logoutHandler = require("../controllers/logoutHandler");
const validateRegisterReq = require("../validationator/validateRegisterReq");
const employeeChangePassword = require("../controllers/employeeChangePassword");
const validateEmployeeChangePassword =
require("../validationator/validateEmployeeChangePassword");
const validateAdminResetPassword =
require("../validationator/validateAdminResetPassword");
const adminResetPassword = require("../controllers/adminResetPassword");


router.post("/register",
    authenticateServiceReq({useRole: true}),
    validateRegisterReq,
    registerEmployee,
);

router.post("/login",
    csrfProtection,
    validateLoginReq(),
    loginEmployee,
);

router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({csrfToken: req.csrfToken()});
});


router.post("/refresh-token",
    csrfProtection,
    authenticateServiceReq(),
    refreshTokenRenewal,
);

router.post("/logout",
    csrfProtection,
    authenticateServiceReq(),
    logoutHandler,
);

router.post("/change-password",
    csrfProtection,
    authenticateServiceReq(),
    validateEmployeeChangePassword(),
    employeeChangePassword,
);

router.post("/reset-password",
    csrfProtection,
    authenticateServiceReq({useRole: true}),
    validateAdminResetPassword(),
    adminResetPassword,
);

module.exports = router;
