const pool = require('./db');

const registerUser = async (username, password) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({success: true, message: "User registered successfully"});
    }, 500);
  });
};

const getEmployeeRoleById = async (employeeId) => {
  try {
    const query = `SELECT roles.name AS role
                   FROM employee_roles
                   JOIN roles ON employee_roles.role_id = roles.roleId
                   WHERE employee_roles.employee_id = $1;`;
    const result = await pool.query(query, [employeeId]);

    if (result.rows.length === 0) {
      return undefined;
    }

    return result.rows[0];
  } catch (err) {
    console.error()
    return undefined;
  }
};


module.exports = {registerUser, getEmployeeRoleById}