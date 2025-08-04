const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../../.env' })

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

const requestBuilder = async(url, method, employeeData = {}) => {
  console.log(employeeData)
  const token = jwt.sign({ roles: ['AUTH_SERVICE'] }, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '1m',
    issuer: 'auth-service'
  });

  const requestOption = {
    method: `${method}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase());
  if (hasBody && Object.keys(employeeData).length > 0) {
    requestOption.body = JSON.stringify(employeeData);
  }

  const response = await fetch(`${url}`, requestOption)
  const data = await response.json()
  
  return data
}

module.exports = requestBuilder