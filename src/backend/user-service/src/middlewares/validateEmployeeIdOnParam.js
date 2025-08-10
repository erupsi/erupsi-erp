const {body, validationResult} = require("express-validator");
/**
 * An array of Express-validator middleware functions.
 * This middleware chain validates that the 'employeeId' route parameter exists and is a valid UUID (version 4).
 * If the validation fails, it halts the request and responds with a 400 status and a corresponding error message.
 *
 * @constant
 * @type {Array<Function>}
 */


const validateEmployeeIdOnParam = () => {
    return [
        body().custom((value, {req}) => {
            const allowedKeys = ["employeeId"];
            const receivedKeys = Object.keys(req.body);

            const invalidKeys = receivedKeys.filter((key) =>
                !allowedKeys.includes(key));

            if (invalidKeys.length > 0) {
                throw new Error(`Properti yang tidak diizinkan terdeteksi:
                  ${invalidKeys.join(", ")}. Hanya 
                  ${allowedKeys.join(", ")} yang diizinkan.`);
            }
            return true;
        }),

        body("employeeId")
            .notEmpty().withMessage("employeeId cannot be empty.")
            .bail()
            .isUUID().withMessage("employeeId type must be UUID.")
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

module.exports = validateEmployeeIdOnParam;
