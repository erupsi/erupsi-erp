const {findAllEmployeeDetails} = require('../services/urmService');

/**
 * Retrieves and returns a list of all employees.
 * @async
 * @function getAllEmployee
 * @param {import('express').Request} req - The Express request object (not used in this handler).
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response containing an array of employee objects or an error message.
 */

const getAllEmployee = async (req, res) => {
  try{
    const result = await findAllEmployeeDetails();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No employees found." });
    }
    
    // Return the list of employees
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error retrieving employees:", error); // Log the error for debugging
    return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
}

module.exports = getAllEmployee