
const {checkEmployeeById, insertRolesToEmployee} = require('../services/urmService');
const validator = require('validator');

const assignRoleToEmployee =  async (req, res) => {
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

    const assignedEmployee = await insertRolesToEmployee(employeeId, rolesToAssign)
    if(!assignedEmployee.success){
      return res.status(400).json({error: assignedEmployee.message})
    }

    return res.status(200).json({success: "Role pegawai berhasil diubah"})

  }catch(error){
    console.error(error)
    return res.status(500).json({error: "Terjadi kesalahan server internal"})
  }
}

module.exports = assignRoleToEmployee