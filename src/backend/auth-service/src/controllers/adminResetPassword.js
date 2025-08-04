const { changeEmployeePassword } = require("../services/authService");
const { bcryptSalting } = require("../utils/passwordUtils");

const adminResetPassword = async(req, res, next) => {
  try{
    const {username, password} = req.body;

    const hashedPassword = await bcryptSalting(password)

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 1)

    const resetEmployeePassword = await changeEmployeePassword(username, hashedPassword, expiryDate)

    if(!resetEmployeePassword){
      return res.status(500).json({error: "Internal server error"})
    }

    return res.status(201).json({message: "Password changed successfully"})
  
  }catch(error){
    console.error(error)
    return res.status(500).json({error: "Internal server error"})
  }
}

module.exports = adminResetPassword