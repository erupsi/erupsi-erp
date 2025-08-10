const {body, validationResult} = require("express-validator");

const validateEmployeeChangePassword = () => {
    return [
        body().custom((value, {req}) => {
            const allowedKeys = ["oldPassword", "newPassword"];
            const receivedKeys = Object.keys(req.body);

            const invalidKeys = receivedKeys.filter((key) =>
                !allowedKeys.includes(key));

            if (invalidKeys.length > 0) {
                throw new Error(
                    `Properti yang tidak diizinkan terdeteksi: 
                      ${invalidKeys.join(", ")}. Hanya ${allowedKeys
    .join(", ")} yang diizinkan.`);
            }
            return true;
        }),

        body("oldPassword")
            .notEmpty().withMessage("oldPassword cannot be empty.")
            .bail()
            .isString().withMessage("oldPassword type must be string.")
            .trim(),

        body("newPassword")
            .notEmpty().withMessage("newPassword cannot be empty.")
            .bail()
            .isString().withMessage("newPassword type must be string.")
            .bail()
            .isLength({min: 8})
            .withMessage("Password length doesn't suffice.")
            .bail()
            .isLength({max: 20})
            .withMessage("Password length is too long.")
            .bail()
            .matches(/\d/)
            .withMessage("newPassword must contain at least one number.")
            .matches(/[A-Z]/)
            .withMessage(`newPassword must 
              contain at least one uppercase letter.`)
            .matches(/[a-z]/)
            .withMessage(`newPassword must contain
              at least one lowercase letter.`)
            .matches(/[@$!%*?&]/)
            .withMessage(`newPassword must contain at least
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

module.exports = validateEmployeeChangePassword;
