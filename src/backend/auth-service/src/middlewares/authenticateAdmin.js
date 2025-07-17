const jwt = require('jsonwebtoken');
const {getEmployeeById} = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET

const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if(!authHeader) {
    return res.status(401).json({message: "Authentication token required"});
  }

  const token = authHeader.split(" ")[1];
  if(!token) {
    return res.status(401).json({message: "Token format is 'Bearer <token>"});
  }

  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded

    const userDetails = await getEmployeeById(req.user.employeeId);

    if(!userDetails || userDetails.role != "admin") {
      return res.status(403).json({message: "Access denied: Admin privileges required"})
    }

    next();
  } catch(error){
    if(error.name === 'TokenExpiredError'){
      return res.status(401).json({message: "Token expired"});
    }
    return res.status(401).json({message: "Invalid or malformed token"});
  }
}

module.exports = authenticateAdmin;