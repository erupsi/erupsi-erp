const {invalidateAndInsertToken,
    searchRefreshToken,
    deleteToken,
    tokenBuilderAssigner,
    deleteTokenByEmpId} = require("../services/RefreshToken");

const {getEmployeeDataFromUrm,
    getEmployeeUsername} = require("../services/authService");
require("dotenv").config({path: __dirname + "/../../../../../.env"});


const refreshAccessToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({error: "Token not found"});
        }

        const tokenDataResultArray = await searchRefreshToken(oldRefreshToken);
        const tokenDataResult = tokenDataResultArray[0];

        if (!tokenDataResult) {
            return res.status(403).json({
                error: "Invalid token. Please login again."});
        }

        if (!tokenDataResult.is_valid) {
            await deleteTokenByEmpId(tokenDataResult.employee_id);
            return res.status(403).json({
                error: "Invalid token. Please login again."});
        }

        if (new Date() > new Date(tokenDataResult.expires_at)) {
            await deleteToken(oldRefreshToken);
            return res.status(403).json({
                error: "Token expired. Please login again."});
        }

        const employeeData = await
        getEmployeeDataFromUrm(tokenDataResult.employee_id);
        const employeeRole = employeeData.data.roles;
        const employeeUsername = await
        getEmployeeUsername(tokenDataResult.employee_id);

        const newExpiryDate = new Date();
        newExpiryDate.setHours(newExpiryDate.getHours() + 8);


        const {accessToken, refreshToken} = await tokenBuilderAssigner(
            res, tokenDataResult.employee_id, employeeUsername, employeeRole);
        await invalidateAndInsertToken(
            tokenDataResult.id, refreshToken,
            tokenDataResult.employee_id, newExpiryDate);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 8 * 60 * 60 * 1000,
        });

        res.status(200).json({
            accessToken: accessToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
};

module.exports = refreshAccessToken;
