const { body, param, validationResult } = require('express-validator');

const patchRoleValidator = () => {
  return [
    param('employeeId').isUUID().withMessage('ID employee tidak valid.'),
    body().custom(reqBody => {
    const errors = []; // Deklarasikan errors di sini
      for (const key in reqBody) {
        if (key !== 'roles') {
          errors.push(`Properti '${key}' tidak diizinkan untuk diupdate.`);
        }
      }
      if ('roles' in reqBody) {
        const roles = reqBody.roles
        if(!Array.isArray(roles)){
          errors.push('Properti "roles" harus berupa array.');
        } else if (!roles.every(role => typeof role === 'string')) {
          errors.push('Semua elemen dalam "roles" harus berupa string.');
        }
      }
      if (errors.length > 0) {
        throw new Error(errors.join(' '));
      }
      return true
    }),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
};

module.exports = patchRoleValidator