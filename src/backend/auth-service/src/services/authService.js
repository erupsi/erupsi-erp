const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

const registerUser = async (employeeInitialUuid, username, password) => {
  try {
    const query = `INSERT INTO auth_employee(employeeId, username, password) VALUES($1, $2, $3)`;
    const result = await pool.query(query, [employeeInitialUuid, username, password]);
    return {success: true}
  } catch (err) {
    console.error(err)
  }
};

module.exports = {registerUser}