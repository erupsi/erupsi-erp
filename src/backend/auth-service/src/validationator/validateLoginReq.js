const { body, param, validationResult } = require('express-validator');
const responseSender = require('../utils/responseSender');

const validateLoginReq = () => {
  console.log("REACHED VALIDATE LOGIN REQ")
  return[
    body().custom((value, { req }) => {
      const allowedKeys = ['username', 'password']; // Daftar properti yang diizinkan
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

module.exports = validateLoginReq;
