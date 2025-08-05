/* eslint-disable camelcase */
const pool = require("./db");

/**
 * Finds detailed information for a single employee by their ID, including their assigned roles.
 * @async
 * @function findEmployeeDetailByEmployeeId
 * @param {string} employeeId - The UUID of the employee to find.
 * @returns {Promise<object|undefined>}
 * A promise that resolves to an object containing the employee's details
 * (full_name, email, department, position, roles) or undefined if not found or an error occurs.
 */

/**
 * Inserts a new employee's details and assigns an initial role in a single transaction.
 * @async
 * @function insertEmployeeDetailsToDb
 * @param {string} employeeId - The new employee's UUID.
 * @param {string} fullName - The employee's full name.
 * @param {string} email - The employee's email address.
 * @param {string} department - The employee's department.
 * @param {string} position - The employee's position.
 * @param {string} roleName - The name of the initial role to assign.
 * @returns {Promise<{success: boolean, message: string}>}
 * A promise that resolves to an object indicating the success or failure of the operation.
 */

/**
 * Checks if an employee exists in the database by their ID.
 * @async
 * @function findEmployeeById
 * @param {string} employeeId - The UUID of the employee to check.
 * @returns {Promise<{success: boolean, message?: string}>}
 * A promise that resolves to an object indicating if the employee was found.
 */

/**
 * Partially updates an employee's details in the database.
 * Only fields specified in `allowedFields` will be updated.
 * @async
 * @function updateEmployeePartially
 * @param {string} employeeId - The UUID of the employee to update.
 * @param {object} updates - An object with key-value pairs of fields to update.
 * @param {string[]} allowedFields - An array of strings representing the field names that are permitted to be updated.
 * @returns {Promise<{success: boolean, message: string}>}
 * A promise that resolves to an object indicating the success or failure of the update operation.
 */

/**
 * Deletes an employee from the database based on their ID.
 * This operation is performed within a transaction.
 * @async
 * @function deleteEmployeeBasedOnId
 * @param {string} employeeId - The UUID of the employee to delete.
 * @returns {Promise<{success: boolean, message?: string}>}
 * A promise that resolves to an object indicating the success or failure of the deletion.
 */

/**
 * Retrieves details for all employees, including their assigned roles.
 * @async
 * @function findAllEmployeeDetails
 * @returns {Promise<object>}
 * A promise that resolves to the raw node-postgres query result object. The employee data is in `result.rows`.
 */

/**
 * Assigns a new set of roles to an employee, replacing any existing roles.
 * This is done in a transaction, first deleting old roles and then inserting new ones.
 * @async
 * @function insertRolesToEmployee
 * @param {string} employeeId - The UUID of the employee to assign roles to.
 * @param {object} rolesPayload - An object containing the roles to assign.
 * @param {string[]} rolesPayload.roles - An array of role names to be assigned to the employee.
 * @returns {Promise<{success: boolean, message: string}>}
 * A promise that resolves to an object indicating the success or failure of the operation.
 */

/**
 * Retrieves a list of all available roles from the database.
 * @async
 * @function findAllRoles
 * @returns {Promise<Array<object>>}
 * A promise that resolves to an array of role objects, each containing roleid, name, display_name, and description.
 */

/**
 * Finds a specific role by its name.
 * @async
 * @function findRoleByName
 * @param {string} name - The name of the role to find.
 * @returns {Promise<Array<object>>}
 * A promise that resolves to an array containing the matched role object, or an empty array if not found.
 */

/**
 * Inserts a new role into the database.
 * @async
 * @function insertRoleToDb
 * @param {string} newRoleId - The UUID for the new role.
 * @param {string} name - The unique programmatic name of the role (e.g., 'super_admin').
 * @param {string} display_name - The human-readable name of the role (e.g., 'Super Admin').
 * @param {string} description - A description of the role's purpose.
 * @returns {Promise<{success: boolean, message: string}>}
 * A promise that resolves to an object indicating the success or failure of the operation.
 */


const findEmployeeDetailByEmployeeId = async (employeeId) => {
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
        console.error();
        return undefined;
    }
};

const insertEmployeeDetailsToDb = async (employeeId, fullName, email, department, position, roleName) => {
    const client = await pool.connect(); // Get a client from the pool
    try {
        await client.query("BEGIN"); // Start transaction

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

        await client.query("COMMIT"); // Commit transaction
        return {success: true, message: "Employee details inserted successfully"};
    } catch (err) {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.error("Error inserting employee details:", err);
        return {success: false, message: "Failed to insert employee details"};
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const findEmployeeById = async (employeeId) => {
    const checkUserResult = await pool.query("SELECT * FROM employees WHERE employeeId = $1", [employeeId]);
    if (checkUserResult.rows.length === 0) {
        return {success: false, message: "pegawai tidak ditemukan."};
    }
    return {success: true};
};

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
        throw new Error("Tidak ada properti yang valid untuk diupdate.");
    }
    setClauses.push("updated_at = NOW()");

    const sql = `
    UPDATE employees
    SET ${setClauses.join(", ")}
    WHERE employeeId = $${paramIndex}
    RETURNING *
  `;
    queryParams.push(employeeId);
    const client = await pool.connect(); // Get a client from the pool

    try {
        await client.query("BEGIN");
        await client.query(sql, queryParams);
        await client.query("COMMIT");
        return {success: true, message: "Data pegawai berhasil diupdate"};
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in updatePartialUser service:", error);
        return {success: false, message: "Data pegawai gagal diupdate"};
    } finally {
        client.release();
    }
};

const deleteEmployeeBasedOnId = async (employeeId) => {
    const client = await pool.connect();

    const sql = "DELETE FROM employees WHERE employeeId=$1";

    try {
        await client.query("BEGIN");
        await client.query(sql, [employeeId]);
        await client.query("COMMIT");
        return {success: true};
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return {success: false, message: "Tidak dapat menghapus pegawai"};
    } finally {
        client.release();
    }
};

const findAllEmployeeDetails = async () => {
    const sql = `SELECT 
      employees.employeeId,
      employees.full_name,
      employees.email,
      employees.department,
      employees.position,
      employees.is_active,
      ARRAY_AGG(roles.name) AS roles
    FROM employees
    LEFT JOIN employee_roles ON employees.employeeId = employee_roles.employee_id
    LEFT JOIN roles ON employee_roles.role_id = roles.roleId
    GROUP BY employees.employeeId,
    employees.full_name, employees.email, employees.department, employees.position, employees.is_active;`;

    const result = await pool.query(sql);
    return result;
};

const insertRolesToEmployee = async (employeeId, rolesPayload = {}) => {
    const client = await pool.connect(); // Get a client from the pool

    try {
        await client.query("BEGIN"); // Start transaction

        const roles = rolesPayload.roles;

        // Validate roles input
        if (!Array.isArray(roles) || !roles.every((role) => typeof role === "string")) {
            throw new Error("Properti \"roles\" harus berupa array dengan elemen string.");
        }

        // Fetch role IDs for the given roles
        const roleIds = [];

        if (roles.length > 0) { // Hanya proses jika ada peran yang diminta
            // Menggunakan klausa ANY untuk mengambil semua roleid dalam satu query
            const roleQuery = "SELECT roleid, name FROM roles WHERE name = ANY($1)";
            const roleResult = await client.query(roleQuery, [roles]);

            if (roleResult.rows.length !== roles.length) {
                // Identifikasi peran mana yang tidak ditemukan
                const foundRoleNames = roleResult.rows.map((row) => row.name);
                const notFoundRoles = roles.filter((roleName) => !foundRoleNames.includes(roleName));
                return {success: false, message: `Beberapa peran tidak ditemukan: ${notFoundRoles.join(", ")}.`};
            }
            roleIds.push(...roleResult.rows.map((row) => row.roleid));
        }

        await client.query("DELETE FROM employee_roles WHERE employee_id = $1", [employeeId]);

        // Insert employeeId and roleId into employee_roles table
        if (roleIds.length > 0) { // Hanya sisipkan jika ada roleId yang valid
            const valuesPlaceholder = roleIds.map((_, index) => `($1, $${index + 2})`).join(", ");
            const insertParams = [employeeId, ...roleIds];

            const employeeRoleQuery = `
            INSERT INTO employee_roles (employee_id, role_id)
            VALUES ${valuesPlaceholder}
            ON CONFLICT (employee_id, role_id) DO NOTHING; -- Menghindari duplikat jika ada race condition
        `;
            await client.query(employeeRoleQuery, insertParams);
        }

        await client.query("COMMIT"); // Commit transaction
        return {success: true, message: "Roles pegawai berhasil diubah."};
    } catch (err) {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.error("Error assigning roles to employee:", err);
        return {success: false, message: "Gagal mengubah roles ke pegawai."};
    } finally {
        client.release(); // Release the client back to the pool
    }
};

const findAllRoles = async () => {
    const sql =
  `SELECT
    roleid,
    name,
    display_name,
    description
  FROM
    roles;`;

    const result = await pool.query(sql);
    return result.rows;
};

const findRoleByName = async (name) => {
    const sql = "SELECT * FROM roles WHERE name = $1;";

    const result = await pool.query(sql, [name]);

    return result.rows;
};

const insertRoleToDb = async (newRoleId, name, display_name, description) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const sql = "INSERT INTO roles (roleid, name, display_name, description) VALUES ($1, $2, $3, $4)";
        await client.query(sql, [
            newRoleId,
            name,
            display_name,
            description,
        ]);
        await client.query("COMMIT");
        return {success: true, message: "Roles added successfully"};
    } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.error("Error adding roles details:", error);
        return {success: false, message: "Failed to add roles"};
    }
};

module.exports = {
    findEmployeeDetailByEmployeeId,
    insertEmployeeDetailsToDb,
    findEmployeeById,
    updateEmployeePartially,
    deleteEmployeeBasedOnId,
    findAllEmployeeDetails,
    insertRolesToEmployee,
    findAllRoles,
    insertRoleToDb,
    findRoleByName,
};


