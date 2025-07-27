const { param, validationResult } = require('express-validator');

/**
 * An array of Express-validator middleware functions.
 * This middleware chain validates that the 'employeeId' route parameter exists and is a valid UUID (version 4).
 * If the validation fails, it halts the request and responds with a 400 status and a corresponding error message.
 *
 * @constant
 * @type {Array<Function>}
 */


const validateEmployeeIdOnParam = [
  // 1. Aturan: Cek 'employeeId' di parameter URL dan pastikan itu adalah UUID.
  param('employeeId')
    .isUUID(4) // Tentukan versi UUID jika perlu, versi 4 adalah yang paling umum.
    .withMessage('Format Employee ID tidak valid. Harap gunakan format UUID.'),

  // 2. Handler: Tangani hasil validasi.
  (req, res, next) => {
    const errors = validationResult(req);
    // Jika ada error validasi, kirim respons 400.
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    // Jika tidak ada error, lanjutkan ke handler berikutnya.
    next();
  },
];

module.exports = validateEmployeeIdOnParam;