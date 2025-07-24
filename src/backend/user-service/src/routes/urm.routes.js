const express = require('express');
const router = express.Router();
const {authenticateServiceRequest} = require('../middlewares/authenticateServiceRequest');
const { getEmployeeDetailByEmployeeId, insertEmployeeDetailsToDb, checkEmployeeById, updateEmployeePartially, deleteEmployeeBasedOnId, getAllEmployeeDetails, assignEmployeeWithRoles} = require('../services/urmService');
const patchBodyValidator = require('../middlewares/patchBodyValidator')
const patchRoleUpdateValidator = require('../middlewares/patchRoleUpdateValidator')
const validator = require('validator');
const { check } = require('express-validator');

router.get("/employee", authenticateServiceRequest({useRole: true}), async (req, res, next) => {
  try{
    const result = await getAllEmployeeDetails();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No employees found." });
    }
    
    // Return the list of employees
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error retrieving employees:", error); // Log the error for debugging
    return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
})

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
      return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
    }

    const updatedEmployee = await updateEmployeePartially(employeeId, updates, ALLOWED_USER_PATCH_FIELDS)

    if (!updatedEmployee.success) {
      return res.status(400).json({ message: 'Tidak ada properti yang valid untuk diupdate atau pengguna tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Data Pegawai berhasil diupdate' });

  } catch (error) {
    console.error('Error updating user in PostgreSQL:', error);
    res.status(500).json({ message: 'Kesalahan server internal.' });
  }
})
  
router.delete("/employee/:employeeId", authenticateServiceRequest({useRole: true}), async(req, res) => {
  const {employeeId} = req.params;
  if(!validator.isUUID(employeeId)){
    return res.status(400).json({error: "Invalid employee ID format"})
  }
    
  try{
    const checkUserResult = await checkEmployeeById(employeeId);
    if(!checkUserResult.success){
      return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
    }

    const deletedUser = await deleteEmployeeBasedOnId(employeeId)
    if(!deletedUser.success) {
      return res.status(400).json({message: "Pegawai tidak dapat dihapus"})
    }
    return res.status(200).json({message: "Pegawai berhasil dihapus"})

  } catch(error){
    console.error(error)
    return res.status(500).json({error: "Terjadi kesalahan server internal"})
  }
})

router.put("/employee/:employeeId/roles"
  ,authenticateServiceRequest({useRole: true})
  ,patchRoleUpdateValidator(), async (req, res) => {
  
  const employeeId = req.params.employeeId;
  const rolesToAssign = req.body;

  try{
    if(!validator.isUUID(employeeId)){
      return res.status(400).json({error: "Invalid employee ID format"})
    }

    const checkUserResult = await checkEmployeeById(employeeId);
    if(!checkUserResult.success){
      return res.status(404).json({ message: 'Pegawai tidak ditemukan.' });
    }

    const assignedEmployee = await assignEmployeeWithRoles(employeeId, rolesToAssign)
    if(!assignedEmployee.success){
      return res.status(400).json({error: assignedEmployee.message})
    }

    return res.status(200).json({success: "Role pegawai berhasil diubah"})

  }catch(error){
    console.error(error)
    return res.status(500).json({error: "Terjadi kesalahan server internal"})
  }
})

module.exports = router;