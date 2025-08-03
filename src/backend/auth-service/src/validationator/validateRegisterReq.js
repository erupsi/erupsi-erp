const { body, param, validationResult } = require('express-validator');
const validateRegisterReq = () => {
  return[
    body().custom((value, { req }) => {
      const allowedKeys = ['username', 'password', 'fullName', 'email', 'department', 'position', 'roleName', 'passwordExpiry']; // Daftar properti yang diizinkan
      const receivedKeys = Object.keys(req.body); // Properti yang diterima dari request

      const invalidKeys = receivedKeys.filter(key => !allowedKeys.includes(key));

      if (invalidKeys.length > 0) {
        throw new Error(`Properti yang tidak diizinkan terdeteksi: ${invalidKeys.join(', ')}. Hanya ${allowedKeys.join(', ')} yang diizinkan.`);
      }
      return true;
    }),
    body('username')
      .notEmpty().withMessage('username cannot be empty.')
      .bail()
      .isString().withMessage('username type must be string.')
      .trim(), // Opsional: Hapus spasi di awal/akhir

    body('password')
      .notEmpty().withMessage('password cannot be empty.')
      .bail()
      .isString().withMessage('password type must be string.')
      .trim(),
    
    body('fullName')
      .notEmpty().withMessage('fullName cannot be empty.')
      .bail()
      .isString().withMessage('fullName type must be string.')
      .trim(),

    body('email')
      .notEmpty().withMessage('Email cannot be empty.')
      .bail()
      .isEmail().withMessage('email type invalid.')
      .trim(),

    body('department')
      .notEmpty().withMessage('department cannot be empty.')
      .bail()
      .isString().withMessage('department type must be string.')
      .trim(),

    body('position')
      .notEmpty().withMessage('position cannot be empty.')
      .bail()
      .isString().withMessage('position type must be string.')
      .trim(),
    
    body('roleName')
      .notEmpty().withMessage('roleName cannot be empty.')
      .bail()
      .isString().withMessage('roleName type must be string.')
      .trim(),

    body('passwordExpiry')
      .notEmpty().withMessage('passwordExpiry cannot be empty.')
      .bail()
      .isISO8601().withMessage('passwordExpiry type ISO8601.')
      .trim(),

    
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        // return responseSender(res, 400, errorMessages)
        return res.status(400).json(errorMessages)
      }
      next();
    }
  ]  
}

module.exports = validateRegisterReq;
