const { findEmployeeById, deleteEmployeeBasedOnId} = require('../services/urmService');

const deleteEmployee = async(req, res) => {
  const {employeeId} = req.params;
    
  try{
    const checkUserResult = await findEmployeeById(employeeId);
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
}

module.exports = deleteEmployee