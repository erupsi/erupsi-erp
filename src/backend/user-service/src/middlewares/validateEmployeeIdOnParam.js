const { param, validationResult } = require('express-validator');

/**
 * Middleware untuk memvalidasi bahwa 'employeeId' di URL params adalah UUID.
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
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    // Jika tidak ada error, lanjutkan ke handler berikutnya.
    next();
  },
];

module.exports = validateEmployeeIdOnParam;