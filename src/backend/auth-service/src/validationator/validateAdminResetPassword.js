const {body, validationResult} = require("express-validator");

const validateAdminResetPassword = () => {
    return [
        body().custom((value, {req}) => {
            const allowedKeys = ["username", "password"];
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
        body("username")
            .notEmpty().withMessage("username cannot be empty.")
            .bail()
            .isString().withMessage("username type must be string.")
            .trim(),

        body("password")
            .notEmpty().withMessage("password cannot be empty.")
            .bail()
            .isString().withMessage("password type must be string.")
            .bail()
            .isLength({min: 8})
            .withMessage("Password length doesn't suffice.")
            .bail()
            .isLength({max: 20}).withMessage(
                "Password length is too long.",
            )
            .bail()
            .matches(/\d/)
            .withMessage("password must contain at least one number.")
            .matches(/[A-Z]/)
            .withMessage("password must contain at least one uppercase letter.")
            .matches(/[a-z]/)
            .withMessage("password must contain at least one lowercase letter.")
            .matches(/[@$!%*?&]/)
            .withMessage(`password must contain at least 
              one special character (@, $, !, %, *, ?, &).`)
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

module.exports = validateAdminResetPassword;
