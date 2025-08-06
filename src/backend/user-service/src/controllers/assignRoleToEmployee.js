
const {findEmployeeById, insertRolesToEmployee} = require("../services/urmService");
const validator = require("validator");

/**
 * Assigns one or more roles to a specific employee based on their ID.
 * It validates the employee ID, checks for the employee's existence,
 * remove existing employee roles, and then inserts the new roles.
 * @async
 * @function assignRoleToEmployee
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The route parameters.
 * @param {string} req.params.employeeId - The UUID of the employee.
 * @param {Array<string>} req.body - An array of role IDs to assign.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 * A promise that resolves when the response is sent. Sends a JSON response with a success or error message.
 */

const assignRoleToEmployee = async (req, res) => {
    const employeeId = req.params.employeeId;
    const rolesToAssign = req.body;

    try {
        if (!validator.isUUID(employeeId)) {
            return res.status(400).json({error: "Invalid employee ID format"});
        }

        const checkUserResult = await findEmployeeById(employeeId);
        if (!checkUserResult.success) {
            return res.status(404).json({message: "Pegawai tidak ditemukan."});
        }

        const assignedEmployee = await insertRolesToEmployee(employeeId, rolesToAssign);
        if (!assignedEmployee.success) {
            return res.status(400).json({error: assignedEmployee.message});
        }

        return res.status(200).json({success: "Role pegawai berhasil diubah"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Terjadi kesalahan server internal"});
    }
};

module.exports = assignRoleToEmployee;
