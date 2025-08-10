
// const validator = require("validator");
const {findEmployeeDetailByEmployeeId} = require("../services/urmService");

/**
 * Retrieves the details of a specific employee by their employee ID.
 * @async
 * @function getEmployeeDetail
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.params - The URL parameters.
 * @param {string} req.params.employeeId - The ID of the employee whose details are to be fetched.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the employee's details or an error message.
 */

const getEmployeeDetail = async (req, res)=> {
    try {
        const {employeeId} = req.body;

        const result = await findEmployeeDetailByEmployeeId(employeeId);
        if (!result) {
            return res.status(404).json({success: false, message: "Employee not found."});
        }

        return res.status(200).json({success: true, data: result});
    } catch (error) {
        console.error("Error in POST /employee/get-employee:", error); // Log the error for debugging
        res.status(500).json({success: false, message: "Internal server error.", error: error.message});
    }
};

module.exports = getEmployeeDetail;
