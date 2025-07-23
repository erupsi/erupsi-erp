const pool = require('./db');

const getEmployeeDetailByEmployeeId = async (employeeId) => {
  try {
    const query = `SELECT 
        employees.full_name,
        employees.email,
        employees.department,
        employees.position,
        ARRAY_AGG(roles.name) AS roles
      FROM employees
      JOIN employee_roles ON employees.employeeId = employee_roles.employee_id
      JOIN roles ON employee_roles.role_id = roles.roleId
      WHERE employees.employeeId = $1
      GROUP BY employees.full_name, employees.email, employees.department, employees.position;`;
    const result = await pool.query(query, [employeeId]);

    if (result.rows.length == 0) {
      return undefined;
    }

    return result.rows[0];
  } catch (err) {
    console.error()
    return undefined;
  }
};

const insertEmployeeDetailsToDb = async (employeeId, fullName, email, department, position, roleName) => {
  const client = await pool.connect(); // Get a client from the pool
  try {
    await client.query('BEGIN'); // Start transaction

    // Insert into the `employees` table
    const employeeQuery = `
      INSERT INTO employees (employeeId, full_name, email, department, position)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await client.query(employeeQuery, [employeeId, fullName, email, department, position]);

    // Query the `roles` table to get the roleId
    const roleQuery = `
      SELECT roleId FROM roles WHERE name = $1
    `;
    const roleResult = await client.query(roleQuery, [roleName]);

    if (roleResult.rows.length == 0) {
      throw new Error(`Role "${roleName}" does not exist`);
    }

    const roleIdToUse = roleResult.rows[0].roleid;

    // Insert into the `employee_roles` table
    const employeeRoleQuery = `
      INSERT INTO employee_roles (employee_id, role_id)
      VALUES ($1, $2)
    `;
    await client.query(employeeRoleQuery, [employeeId, roleIdToUse]);

    await client.query('COMMIT'); // Commit transaction
    return { success: true, message: 'Employee details inserted successfully' };
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error('Error inserting employee details:', err);
    return { success: false, message: 'Failed to insert employee details' };
  } finally {
    client.release(); // Release the client back to the pool
  }
}

const checkEmployeeById = async (employeeId) => {
  const checkUserResult = await pool.query('SELECT * FROM employees WHERE employeeId = $1', [employeeId]);
  if (checkUserResult.rows.length === 0) {
    return {success: false, message: 'pegawai tidak ditemukan.'}
  }
  return {success: true}
}

const updateEmployeePartially = async (employeeId, updates, allowedFields) => {
  const queryParams = [];
  const setClauses = [];
  let paramIndex = 1;
  
  for (const key in updates) {
    if (allowedFields.includes(key)) {
      setClauses.push(`${key} = $${paramIndex}`);
      queryParams.push(updates[key]);
      paramIndex++;
    }
      // Properti lain yang tidak diizinkan akan diabaikan
  }

  if (setClauses.length === 0) {
    throw new Error('Tidak ada properti yang valid untuk diupdate.');
  }
  setClauses.push(`updated_at = NOW()`);

  const sql = `
    UPDATE employees
    SET ${setClauses.join(', ')}
    WHERE employeeId = $${paramIndex}
    RETURNING *
  `;
  queryParams.push(employeeId);
  const client = await pool.connect(); // Get a client from the pool
  
  try{
    await client.query('BEGIN');
    await client.query(sql, queryParams)
    await client.query('COMMIT');
    return {success: true, message: "Data pegawai berhasil diupdate"}
  } catch(error){
    await client.query('ROLLBACK');
    console.error('Error in updatePartialUser service:', error);
    return {success: false, message: "Data pegawai gagal diupdate"}
  }
}


module.exports = {getEmployeeDetailByEmployeeId, insertEmployeeDetailsToDb, checkEmployeeById, updateEmployeePartially}


