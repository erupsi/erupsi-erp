const {invalidateAndInsertToken, searchRefreshToken, deleteToken, updateToken, tokenBuilderAssigner, deleteTokenByEmpId, invalidateToken, insertToken} = require('../services/RefreshToken')
const {getEmployeeDataFromUrm, getEmployeeUsername} = require('../services/authService')
require('dotenv').config({ path: __dirname + '/../../.env' })
const jwt = require('jsonwebtoken');

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

const refreshAccessToken = async (req, res, next) => {
  try{
    const oldRefreshToken = req.cookies.refreshToken;

    if(!oldRefreshToken) {
      return res.status(401).json({message: "Token not found"})
    }

    const tokenDataResultArray = await searchRefreshToken(oldRefreshToken)
    const tokenDataResult = tokenDataResultArray[0]

    if(!tokenDataResult){
      
      return res.status(403).json({ message: "Invalid token. Please login again." });
    }

    if(!tokenDataResult.is_valid){
      // TODO: IMPLEMENT USER LOGOUUT AUTO HERE
      await deleteTokenByEmpId(tokenDataResult.employee_id);
      const dateTimeNow = new Date()
      console.log(`This employee: [${employeeUsername}] session is compromised at:${dateTimeNow} `)
      return res.status(403).json({ message: "Invalid token. Please login again." });
    }

    if (new Date() > new Date(tokenDataResult.expires_at)) {
      await deleteToken(oldRefreshToken)
      return res.status(403).json({ message: "Token expired. Please login again." });
    }

    const employeeData = await getEmployeeDataFromUrm(tokenDataResult.employee_id)
    console.log(employeeData)
    const employeeUsername = await getEmployeeUsername(tokenDataResult.employee_id)

    const newExpiryDate = new Date();
    newExpiryDate.setHours(newExpiryDate.getHours() + 8);

    

    const {accessToken, refreshToken} = await tokenBuilderAssigner(res,tokenDataResult.employee_id, employeeUsername, employeeData.role)
    //tokenId, refreshToken, employeeId, expiresAt
    await invalidateAndInsertToken(tokenDataResult.id, refreshToken, tokenDataResult.employee_id, newExpiryDate)
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000
    });
    
    res.json({
      accessToken: accessToken
    });

  } catch(error){
    console.error(error)
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = refreshAccessToken