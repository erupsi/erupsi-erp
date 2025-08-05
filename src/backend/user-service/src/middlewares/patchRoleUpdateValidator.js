const {body, validationResult} = require("express-validator");

/**
 * A factory function that returns an array of Express-validator middleware.
 * This middleware is designed to validate the body of a PATCH request for updating an employee's roles.
 *
 * The validation checks:
 * 1. That the request body only contains a 'roles' property.
 * 2. That the 'roles' property is an array.
 * 3. That every element within the 'roles' array is a string.
 *
 * If validation fails, it sends a 400 response with an array of error messages.
 *
 * @function patchRoleValidator
 * @returns {Array<Function>} An array of Express middleware functions for validation.
 */

const patchRoleValidator = () => {
    return [
        body().custom((reqBody) => {
            const errors = []; // Deklarasikan errors di sini
            for (const key in reqBody) {
                if (key !== "roles") {
                    errors.push(`Properti '${key}' tidak diizinkan untuk diupdate.`);
                }
            }
            if ("roles" in reqBody) {
                const roles = reqBody.roles;
                if (!Array.isArray(roles)) {
                    errors.push("Properti 'roles' harus berupa array.");
                } else if (!roles.every((role) => typeof role === "string")) {
                    errors.push("Semua elemen dalam \"roles\" harus berupa string.");
                }
            }
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            return true;
        }),

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

module.exports = patchRoleValidator;
