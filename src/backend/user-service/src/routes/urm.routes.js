const express = require('express');
const router = express.Router();
const {authenticateServiceRequest} = require('../middlewares/authenticateServiceRequest');
const { getEmployeeDetailByEmployeeId, insertEmployeeDetailsToDb, checkEmployeeById, updateEmployeePartially} = require('../services/urmService');
const patchBodyValidator = require('../middlewares/patchBodyValidator')
const validator = require('validator');

router.post("/employee", authenticateServiceRequest(), async(req, res) => {

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

router.get("/employee/:employeeId", authenticateServiceRequest(), async(req, res)=> {
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

router.patch("/employee/:employeeId", authenticateServiceRequest({useRole: true}), patchBodyValidator(), async(req, res) => {
  const ALLOWED_USER_PATCH_FIELDS = ['full_name', 'email', 'department', 'position', 'is_active'];

  const employeeId = req.params.employeeId;
  const updates = req.body;

  try {
    // Cek apakah user ada (opsional, tapi disarankan untuk respons 404 yang akurat)
    const checkUserResult = await checkEmployeeById(employeeId);
    if (checkUserResult.success == false) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    const updatedEmployee = await updateEmployeePartially(employeeId, updates, ALLOWED_USER_PATCH_FIELDS)

    if (!updatedEmployee) {
      return res.status(400).json({ message: 'Tidak ada properti yang valid untuk diupdate atau pengguna tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Data pengguna berhasil diupdate' });

  } catch (error) {
    console.error('Error updating user in PostgreSQL:', error);
    res.status(500).json({ message: 'Kesalahan server internal.' });
  }
})
  

module.exports = router;