/**
 * @fileoverview Login request validation middleware using express-validator
 * @module validationator/validateLoginReq
 */

const {body, validationResult} = require("express-validator");

/**
 * Creates validation middleware for login requests
 * @function validateLoginReq
 * @return {Array<Function>} Array of express-validator middleware functions
 * @description
 * Validates login request body ensuring:
 * 1. Only allowed properties (username, password) are present
 * 2. Username is non-empty string
 * 3. Password is non-empty string
 * 4. Trims whitespace from inputs
 *
 * @example
 * // Usage in route
 * router.post('/login', validateLoginReq(), loginController);
 *
 * // Valid request body
 * {
 *   "username": "john.doe",
 *   "password": "securePassword123"
 * }
 *
 * // Error response for invalid data
 * {
 *   "error": ["username cannot be empty."]
 * }
 */
const validateLoginReq = () => {
    return [
        body().custom((value, {req}) => {
            const allowedKeys = ["username", "password"];
            const receivedKeys = Object.keys(req.body);

            const invalidKeys = receivedKeys
                .filter((key) => !allowedKeys.includes(key));

            if (invalidKeys.length > 0) {
                throw new Error(
                    `Properti yang tidak diizinkan terdeteksi: ${invalidKeys
                        .join(", ")}.
                          Hanya ${allowedKeys.join(", ")} yang diizinkan.`);
            }
            return true;
        }),
        body("username")
            .notEmpty().withMessage("username cannot be empty.")
            .bail()
            .isString().withMessage("username type must be string.")
            .trim(),

        body("password")
            .notEmpty().withMessage("password cannot be empty.")
            .bail()
            .isString().withMessage("password type must be string.")
            .trim(),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                return res.status(400).json({error: errorMessages});
            }
            next();
        },
    ];
};

module.exports = validateLoginReq;
