const responseSender = require("../utils/responseSender");

const validateRegisterEmployeeReqBody = (req, res, next) => {
  if (req.body === undefined){
      // return responseSender(res, 400, "Invalid or malformed token")
      return res.status(400).json("Invalid or malformed token")
    }
  
  const {username, password, fullName, email, department, position, roleName } = req.body;
    
  if(!username || !password || !fullName || !email || !department || !position || !roleName) {
    // return responseSender(res, 400,  "Invalid or malformed token")
    return res.status(400).json("Invalid or malformed token")
  }
  next()
}

module.exports = validateRegisterEmployeeReqBody