const {bcryptSalting, comparator} = require('../utils/passwordUtils')
const {checkEmployeeByUsername, getEmployeeDataFromUrm} = require('../services/authService')
const responseSender = require('../utils/responseSender')
const { tokenBuilderAssigner } = require('../services/RefreshToken')

const loginEmployee = async(req, res, next) =>{
  try{
    const {username, password} = req.body
    const employeeData = await checkEmployeeByUsername(username)
    
    if(!employeeData){
      return res.status(401).json("Invalid username or password")
    }

    const hashedPass = employeeData.password
    const isPasswordMatch = await comparator(password, hashedPass)

    if(!isPasswordMatch){
      // return responseSender(res, 401, "Invalid username or password")
      return res.status(401).json("Invalid username or password")
    }
    const employeeRole = await getEmployeeDataFromUrm(employeeData.employeeid)
    const {refreshToken, accessToken} = await tokenBuilderAssigner(res, employeeData.employeeid, username, employeeRole.roles, {replace_token: true})
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 
    });

    res.json({
      message: "Login successful",
      accessToken: accessToken
    });

  }catch(error) {
    console.log("Error lagi at login employee")
    console.error(error)
    return res.status(500).json("Internal server error At Login Employee");
  }
}

module.exports = loginEmployee;