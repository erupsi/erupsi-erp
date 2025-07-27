const {findEmployeeById, updateEmployeePartially} = require('../services/urmService');

/**
 * Partially updates an employee's details based on their ID.
 * This function only allows specific fields ('full_name', 'email', 'department', 'position', 'is_active') to be updated.
 * It first checks if the employee exists before attempting the update.
 * @async
 * @function editEmployeeDetails
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The URL parameters.
 * @param {string} req.params.employeeId - The ID of the employee to update.
 * @param {object} req.body - An object containing the properties to update.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response confirming the update or reporting an error.
 */

const editEmployeeDetails = async(req, res) => {
  const ALLOWED_USER_PATCH_FIELDS = ['full_name', 'email', 'department', 'position', 'is_active'];

  const employeeId = req.params.employeeId;
  const updates = req.body;

  try {
    // Cek apakah user ada (opsional, tapi disarankan untuk respons 404 yang akurat)
    const checkUserResult = await findEmployeeById(employeeId);
    if (checkUserResult.success == false) {
      return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
    }

    const updatedEmployee = await updateEmployeePartially(employeeId, updates, ALLOWED_USER_PATCH_FIELDS)

    if (!updatedEmployee.success) {
      return res.status(400).json({ message: 'Tidak ada properti yang valid untuk diupdate atau pegawai tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Data Pegawai berhasil diupdate' });

  } catch (error) {
    console.error('Error updating user in PostgreSQL:', error);
    res.status(500).json({ message: 'Kesalahan server internal.' });
  }
}

module.exports = editEmployeeDetails