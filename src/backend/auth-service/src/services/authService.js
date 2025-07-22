const pool = require('./db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../../.env' })

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');;

const registerUser = async (employeeInitialUuid, username, password) => {
  try {
    const isEmployeeExist = await checkEmployeeByUsername(username)

    if(isEmployeeExist) {
      return {success: false, message: "User Already Defined"}
    }

    const query = `INSERT INTO auth_employee(employeeId, username, password) VALUES($1, $2, $3)`;
    await pool.query(query, [employeeInitialUuid, username, password]);
    return {success: true}
  } catch (err) {
    return {success: false, message: err}
  }
};

const checkEmployeeByUsername = async (employeeUsername) => {
  try {
    const query = `SELECT * FROM auth_employee WHERE username=$1`;
    const employeeIdFromQuery = await pool.query(query, [employeeUsername]);
    return employeeIdFromQuery.rows[0]
  } catch (err) {
    return false
  }
}

const AddEmployeeRequestToUrm = async (argEmployeeId, argFullName, argEmail, argDepartment, argPosition, argRoleName) => {
  try{
    if(!argEmployeeId || !argFullName || !argEmail || !argDepartment || ! argPosition || !argRoleName){
      throw new Error('Employee data is less than required');
    }

    const employeeData = {
      employeeId: argEmployeeId, 
      fullName: argFullName,
      email: argEmail, 
      department: argDepartment, 
      position: argPosition,
      roleName: argRoleName
    }

    const token = jwt.sign({ service: 'auth-service' }, PRIVATE_KEY, {
      algorithm: 'RS256',
      audience: 'urm-service',
      expiresIn: '1m',
      issuer: 'auth-service'
    });

    const response = await fetch('http://localhost:3001/urm/employee', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data;

  }catch(error){
    console.error('Error in AddEmployeeRequestToUrm:', error);
    throw error;
  }
}

module.exports = {registerUser, AddEmployeeRequestToUrm}