const express = require('express');
const router = express.Router();
const {authenticateServiceRequest} = require('../middlewares/authenticateServiceRequest');
const { getEmployeeDetailByEmployeeId, insertEmployeeDetailsToDb } = require('../services/urmService');
const validator = require('validator');

router.post("/employee", authenticateServiceRequest, async(req, res) => {

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
      res.status(201).json({success: true, message: "Pengguna berhasil didaftarkan"})
    }else{
      res.status(400).json({success: false, message: result.message || "Gagal mendaftarkan pengguna"})
    }
  } catch(error) {
    res.status(500).json({success: false, message: "Terjadi kesalahan internal server."})
  }
});

router.get("/employee/:employeeId", authenticateServiceRequest, async(req, res)=> {
  try{
    const {employeeId} = req.params;

    if(!validator.isUUID(employeeId)){
      return res.status(400).json({error: "Invalid employee ID format"})
    }

    const result = await getEmployeeDetailByEmployeeId(employeeId)
    if(!result){
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    return res.status(200).json({success: true, data: result})

  }catch(error){
    console.error('Error in GET /employee/:employeeId:', error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
  


})

module.exports = router;