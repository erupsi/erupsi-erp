require('dotenv').config({ path: __dirname + '/../../.env' });
const jwt = require('jsonwebtoken');
const PUBLIC_KEY = process.env.PUBLIC_KEY.replace(/\\n/g, '\n');


const authenticateServiceRequest = (options = {useRole: false}) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader) {
      return res.status(401).json({message: "Authentication token required"});
    }

    const token = authHeader.split(" ")[1];

    if(!token) {
      return res.status(401).json({message: "Token format is 'Bearer <token>"});
    }

    try{
      const decoded = jwt.verify(token, PUBLIC_KEY,{
        algorithms: ['RS256'],
        audience: 'urm-service',
        issuer: 'auth-service'
      });

      if(options.useRole == true) {
        if(!decoded || !decoded.role || !Array.isArray(decoded.role) || !decoded.role.includes('SYSTEM_ADMIN')){
          return res.status(403).json({message: "Access denied: Admin privileges required"})
        }
      }

      next();
    } catch(error){
      if(error.name === 'TokenExpiredError'){
        return res.status(401).json({message: "Token expired"});
      }
      console.error()
      return res.status(401).json({message: "Invalid or malformed token"});
    }
  }
}

module.exports = authenticateServiceRequest;