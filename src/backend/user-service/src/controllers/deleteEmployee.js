const {findEmployeeById, deleteEmployeeBasedOnId} = require("../services/urmService");

/**
 * Deletes an employee based on the employee ID provided in the request parameters.
 * It first checks if the employee exists and then proceeds with the deletion.
 * @async
 * @function deleteEmployee
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The URL parameters.
 * @param {string} req.params.employeeId - The ID of the employee to be deleted.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response to confirm deletion or report an error.
 */

const deleteEmployee = async (req, res) => {
    const {employeeId} = req.params;

    try {
        const checkUserResult = await findEmployeeById(employeeId);
        if (!checkUserResult.success) {
            return res.status(404).json({message: "Pegawai tidak ditemukan."});
        }

        const deletedUser = await deleteEmployeeBasedOnId(employeeId);
        if (!deletedUser.success) {
            return res.status(400).json({message: "Pegawai tidak dapat dihapus"});
        }
        return res.status(200).json({message: "Pegawai berhasil dihapus"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Terjadi kesalahan server internal"});
    }
};

module.exports = deleteEmployee;
