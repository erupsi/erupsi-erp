const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../../.env' })

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

const requestBuilder = async(url, method, employeeData = {}) => {
  const token = jwt.sign({ service: 'auth-service' }, PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: '1m',
      issuer: 'auth-service'
    });

    const response = await fetch(`${url}`, {
      method: `${method}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      ...(Object.keys(employeeData).length > 0 && { body: JSON.stringify(employeeData) })
    });
    const data = await response.json()
    
    return data
}

module.exports = requestBuilder