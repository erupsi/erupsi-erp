const { body, validationResult } = require('express-validator');

const validateRoleCreation = () => {
  return [
    body().custom((value, { req }) => {
      const allowedKeys = ['name', 'display_name', 'description']; // Daftar properti yang diizinkan
      const receivedKeys = Object.keys(req.body); // Properti yang diterima dari request

      const invalidKeys = receivedKeys.filter(key => !allowedKeys.includes(key));

      if (invalidKeys.length > 0) {
        throw new Error(`Properti yang tidak diizinkan terdeteksi: ${invalidKeys.join(', ')}. Hanya ${allowedKeys.join(', ')} yang diizinkan.`);
      }
      return true;
    }),
    body('name')
      .notEmpty().withMessage('Nama peran tidak boleh kosong.')
      .isString().withMessage('Nama peran harus berupa string.')
      .trim(), // Opsional: Hapus spasi di awal/akhir

    body('display_name')
      .notEmpty().withMessage('Nama tampilan peran tidak boleh kosong.')
      .isString().withMessage('Nama tampilan harus berupa string.')
      .trim(),

    body('description')
      .notEmpty().withMessage('Deskripsi tidak boleh kosong.')
      .isString().withMessage('Deskripsi harus berupa string.')
      .trim(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
};

module.exports = validateRoleCreation;