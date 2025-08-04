const {comparator} = require('../utils/passwordUtils')
const {checkEmployeeByUsername, getEmployeeDataFromUrm} = require('../services/authService')
const { tokenBuilderAssigner } = require('../services/RefreshToken')

const loginEmployee = async(req, res, next) =>{
  try{
    const {username, password} = req.body
    const employeeData = await checkEmployeeByUsername(username)

    if(!employeeData){
      return res.status(401).json({error: "Invalid username or password"})
    }

    const employeeId = employeeData.employeeid
    const hashedPass = employeeData.password
    const isPasswordMatch = await comparator(password, hashedPass)

    if(!isPasswordMatch){
      return res.status(401).json({error: "Invalid username or password"})
    }

    const employeeFromUrm = await getEmployeeDataFromUrm(employeeData.employeeid)
    const employeeRole = employeeFromUrm.data.roles

    const {refreshToken, accessToken} = await tokenBuilderAssigner(res, employeeId, username, employeeRole, {replace_token: true})
    
    const responseBody = {
      message: "Login successful",
      accessToken: accessToken,
    }

    const passwordExpiry = employeeData.password_expiry
    const currentDate = new Date()

    const timeLeft = passwordExpiry - currentDate
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))

    if(daysLeft <= 3){
      responseBody.passwordExpiryWarning = 
      `Your password will expire in ${daysLeft} days. Please change it soon.`
    }

    if(daysLeft < 0){
      responseBody.passwordExpired = 
      `Password is expired. Change it now`
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 
    });

    res.status(200).json(responseBody);

  }catch(error) {
    console.log("Error lagi at login employee")
    console.error(error)
    return res.status(500).json({error: "Internal server error At Login Employee"});
  }
}

module.exports = loginEmployee;