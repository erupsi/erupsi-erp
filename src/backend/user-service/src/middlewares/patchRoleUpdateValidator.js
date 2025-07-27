const { body, param, validationResult } = require('express-validator');

const patchRoleValidator = () => {
  return [
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
          errors.push("Properti 'roles' harus berupa array.");
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
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    }
  ];
};

module.exports = patchRoleValidator