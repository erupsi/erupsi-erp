const {insertEmployeeDetailsToDb} = require('../services/urmService');

/**
 * Handles the creation of a new employee.
 * It validates the request body for required employee details and calls a service to insert the data into the database.
 * @async
 * @function createEmployee
 * @param {import('express').Request} req - The Express request object.
 * @param {object} req.body - The request body containing the employee's information.
 * @param {string} req.body.employeeId - The unique ID for the employee.
 * @param {string} req.body.fullName - The full name of the employee.
 * @param {string} req.body.email - The employee's email address.
 * @param {string} req.body.department - The department the employee belongs to.
 * @param {string} req.body.position - The job position of the employee.
 * @param {string} req.body.roleName - The initial role to be assigned to the employee.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating the result of the creation operation.
 */

const createEmployee = async(req, res) => {

  if(req.body === undefined) {
    return res.status(400).json({message: 'Input tidak valid.'})
  }

  const { employeeId, fullName, email, department, position, roleName } = req.body;
  
  if (!employeeId || !fullName || !email || !department || !position || !roleName) {
    return res.status(400).json({ error: 'Missing employee data' });
  }

  try{
    const result = await insertEmployeeDetailsToDb(employeeId, fullName, email, department, position, roleName)
    
    if(result.success){
      res.status(201).json({success: true, message: "Pegawai berhasil didaftarkan"})
    }else{
      res.status(400).json({success: false, message: result.message || "Gagal mendaftarkan pegawai"})
    }
  } catch(error) {
    res.status(500).json({success: false, message: "Terjadi kesalahan internal server."})
  }
}

module.exports = createEmployee