//validate token
//check if the username exist in db
//check if the entered oldPassword is the same
//change new password to db
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: __dirname + '/../../.env' })

const { checkEmployeeByUsername, changeEmployeePassword } = require("../services/authService");
const { comparator, bcryptSalting } = require("../utils/passwordUtils");


const PUBLIC_KEY_FROM_REQUEST = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
//enforce password expiry 60 hari
const employeeChangePassword = async (req, res, next) => {
  try{

  const {oldPassword, newPassword} = req.body

  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, PUBLIC_KEY_FROM_REQUEST,{
    algorithms: ['RS256'],
    iss: 'auth-service'
  });

  const employeeUsername = decoded.username
  if(!employeeUsername){
    return res.status(401).json({message: "You are not authorized to send this request."})
  }

  const employeeData = await checkEmployeeByUsername(employeeUsername)

  const isPasswordMatch = await comparator(oldPassword ,employeeData.password)

  if(!isPasswordMatch){
    return res.status(401).json({message: "Password doesn't match it's predecessor"})
  }
  const isPasswordMatchNew = await comparator(newPassword ,employeeData.password)

  if(isPasswordMatchNew){
    return res.status(401).json({message: "You dumbfuck didn't change anything"}) //CHANGE
  }

  const hashedPassword = await bcryptSalting(newPassword)
  const passExpiry = new Date()
  passExpiry.setDate(passExpiry.getDate() + 60)
  
  const passwordChangeResult = await changeEmployeePassword(employeeUsername, hashedPassword, passExpiry)

  if(!passwordChangeResult.success){
    return res.status(500).json({message: 'Internal server error. Password change attempt unsuccessful'})
  }
    return res.status(200).json({message: 'Your password changed successfully'})
}catch(error){
  return res.status(500).json("Internal server error")
}
}

module.exports = employeeChangePassword