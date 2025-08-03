require('dotenv').config({ path: __dirname + '/../../.env' })
const jwt = require('jsonwebtoken');
const PUBLIC_KEY_FROM_REQUEST = process.env.PUBLIC_KEY_FROM_REQUEST.replace(/\\n/g, '\n');
const responseSender = require('../utils/responseSender')


const authenticateServiceReq = (option = {useRole: false}) =>  {
  return async (req, res, next) => {
    try{
    const authHeader = req.headers["authorization"];
    

    if(!authHeader) {
      // return responseSender(res, 401, "Authentication token required!")
           return res.status(401).json("Authentication token required!")
    }

    const token = authHeader.split(" ")[1];
    if(!token) {
      // return responseSender(res, 401, "Token format is 'Bearer <token>")
      return res.status(401).json("Token format is 'Bearer <token>")
    }

    
      const decoded = jwt.verify(token, PUBLIC_KEY_FROM_REQUEST,{
        algorithms: ['RS256'],
        iss: 'auth-service'
      });


      if(option.useRole){
        if(!decoded || !decoded.roles || !Array.isArray(decoded.roles) || !decoded.roles.includes("SYSTEM_ADMIN")) {
           return res.status(401).json("Access denied: Admin privileges required")
        }
      }

      next();
    } catch(error){
      if(error.name === 'TokenExpiredError'){
        // return responseSender(res,401, "Token expired")
        return res.status(401).json("Token Required: Your Token already expired")
      }
      // console.error(error)
      return responseSender(res, 401,  "Invalid or malformed token")
    }
  }
}

module.exports = authenticateServiceReq;