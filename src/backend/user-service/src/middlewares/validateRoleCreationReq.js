const {body, validationResult} = require("express-validator");

/**
 * A factory function that returns an array of Express-validator middleware.
 * This middleware is designed to validate the request body for creating a new role.
 *
 * The validation checks:
 * 1. That the request body only contains the allowed keys: 'name', 'display_name', and 'description'.
 * 2. That each of these required fields is a non-empty string.
 *
 * If validation fails, it sends a 400 response with an array of error messages.
 *
 * @function validateRoleCreation
 * @returns {Array<Function>} An array of Express middleware functions for validation.
 */

const validateRoleCreation = () => {
    return [
        body().custom((value, {req}) => {
            const allowedKeys = ["name", "display_name", "description"]; // Daftar properti yang diizinkan
            const receivedKeys = Object.keys(req.body); // Properti yang diterima dari request

            const invalidKeys = receivedKeys.filter((key) => !allowedKeys.includes(key));

            if (invalidKeys.length > 0) {
                throw new Error(
                    `Properti yang tidak diizinkan terdeteksi:
                    ${invalidKeys.join(", ")}.
                    Hanya ${allowedKeys.join(", ")} yang diizinkan.`);
            }
            return true;
        }),
        body("name")
            .notEmpty().withMessage("Nama peran tidak boleh kosong.")
            .bail()
            .isString().withMessage("Nama peran harus berupa string.")
            .trim(), // Opsional: Hapus spasi di awal/akhir

        body("display_name")
            .notEmpty().withMessage("Nama tampilan peran tidak boleh kosong.")
            .bail()
            .isString().withMessage("Nama tampilan harus berupa string.")
            .trim(),

        body("description")
            .notEmpty().withMessage("Deskripsi tidak boleh kosong.")
            .bail()
            .isString().withMessage("Deskripsi harus berupa string.")
            .trim(),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                return res.status(400).json({errors: errorMessages});
            }
            next();
        },
    ];
};

module.exports = validateRoleCreation;
