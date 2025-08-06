const csrf = require("csurf");

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    },
});

const csrfHandler = async (req, res) => {
    res.json({csrfToken: req.csrfToken()});
};

const handlerErrorCsrf = async (err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({
            error: "Token CSRF tidak valid. Permintaan diblokir.",
        });
    }
    console.error(err);
    next(err);
};

module.exports = {csrfProtection, csrfHandler, handlerErrorCsrf};
