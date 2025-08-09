const {deleteToken} = require("../services/RefreshToken");

const logoutHandler = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.sendStatus(204);
        }

        await deleteToken(refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        return res.status(200).json({message: "Logout successful"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
};

module.exports = logoutHandler;
