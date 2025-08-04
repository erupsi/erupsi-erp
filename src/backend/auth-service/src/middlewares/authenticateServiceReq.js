require('dotenv').config({ path: __dirname + '/../../.env' })
const jwt = require('jsonwebtoken');
const PUBLIC_KEY_FROM_REQUEST = process.env.PUBLIC_KEY_FROM_REQUEST.replace(/\\n/g, '\n');


const authenticateServiceReq = (option = {useRole: false}) =>  {
  return async (req, res, next) => {
    try{
    const authHeader = req.headers["authorization"];
    
    if(!authHeader) {
      return res.status(401).json({error: "Authentication token required!"})
    }

    const token = authHeader.split(" ")[1];
    if(!token) {
      return res.status(401).json({error: "Token format is 'Bearer <token>"})
    }

    const decoded = jwt.verify(token, PUBLIC_KEY_FROM_REQUEST,{
      algorithms: ['RS256'],
      iss: 'auth-service'
    });

    if(option.useRole){
      if(!decoded || !decoded.roles || !Array.isArray(decoded.roles) || !decoded.roles.includes("SYSTEM_ADMIN")) {
         return res.status(401).json({error: "Access denied: Admin privileges required"})
      }
    }

    next();
    } catch(error){
      if(error.name === 'TokenExpiredError'){
        return res.status(401).json({error: "Token Required: Your Token already expired"})
      }
      console.error(error)
      return res.status(401).json({error: "Invalid or malformed token"})
    }
  }
}

module.exports = authenticateServiceReq;