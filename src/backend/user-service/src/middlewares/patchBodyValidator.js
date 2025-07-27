const { body, param, validationResult } = require('express-validator');
const ALLOWED_USER_PATCH_FIELDS = ['full_name', 'email', 'department', 'position', 'is_active']

const patchBodyValidator = () => {
  return [
    // 1. Validasi ID di URL (gunakan .isInt() jika ID numerik)

    // 2. Validasi body request
    body().custom(reqBody => {
      const errors = []; // Deklarasikan errors di sini
      for (const key in reqBody) {
        // Tambahkan validasi tipe data per properti
        if (!ALLOWED_USER_PATCH_FIELDS.includes(key)) {
            errors.push(`Properti '${key}' tidak diizinkan untuk diupdate.`);
        }
        if (key === 'full_name' && key in reqBody && typeof reqBody[key] !== 'string') {
            errors.push('nama lengkap harus berupa string.');
        }
        if (key === 'email' && key in reqBody && typeof reqBody[key] !== 'string') {
            errors.push('Email harus berupa string.');
        }
        if (key === 'department' && key in reqBody && typeof reqBody[key] !== 'string') {
            errors.push('Department harus berupa string.');
        }
        if (key === 'position' && key in reqBody && typeof reqBody[key] !== 'string') {
            errors.push('Position harus berupa string.');
        }
      }
      if (errors.length > 0) {
        throw new Error(errors.join(', ')); // Akan ditangkap oleh express-validator
      }
      return true; // Validasi berhasil
    }),

    // 3. Middleware untuk memeriksa hasil validasi
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    }
  ];
};

module.exports = patchBodyValidator