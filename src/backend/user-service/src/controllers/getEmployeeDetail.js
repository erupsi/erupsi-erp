
const validator = require('validator');
const { findEmployeeDetailByEmployeeId} = require('../services/urmService');

const getEmployeeDetail = async(req, res)=> {
  try{
    const {employeeId} = req.params;

    const result = await findEmployeeDetailByEmployeeId(employeeId)
    if(!result){
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    return res.status(200).json({success: true, data: result})

  }catch(error){
    console.error('Error in GET /employee/:employeeId:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
}

module.exports = getEmployeeDetail