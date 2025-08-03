const pool = require('./db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../../.env' })
const requestBuilder = require('../utils/requestBuilder');
const { bcryptSalting } = require('../utils/passwordUtils');

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

const registerUser = async (employeeInitialUuid, username, password, passwordExpiry) => {
  try {
    const isEmployeeExist = await checkEmployeeByUsername(username)

    if(isEmployeeExist) {
      return {success: false, message: "User Already Defined"}
    }

    const hashedPass = await bcryptSalting(password)

    const query = `INSERT INTO auth_employee(employeeId, username, password, password_expiry) VALUES($1, $2, $3)`;
    await pool.query(query, [employeeInitialUuid, username, hashedPass, passwordExpiry]);
    return {success: true}
  } catch (err) {
      console.error(err)
      return {success: false}
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

    const response = await requestBuilder('http://localhost:3001/urm/employee', 'POST', employeeData)

    if (!response.success) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;

  }catch(error){
    console.error('Error in AddEmployeeRequestToUrm:', error);
    throw error;
  }
}

const getEmployeeDataFromUrm = async(employeeId) => {
  const response = await requestBuilder(`http://localhost:3001/urm/employee/${employeeId}`, 'GET')
  return response
}

const getEmployeeUsername = async (employeeId) => {
  try {
    const query = `SELECT username FROM auth_employee WHERE employeeId=$1`;
    const employeeIdFromQuery = await pool.query(query, [employeeId]);
    return employeeIdFromQuery.rows[0].username
  } catch (err) {
    console.error(err)
    return false
  }
}

module.exports = {getEmployeeUsername, registerUser, AddEmployeeRequestToUrm, checkEmployeeByUsername, getEmployeeDataFromUrm}