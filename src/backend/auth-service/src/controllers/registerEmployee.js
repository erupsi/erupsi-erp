const { v4: uuidv4 } = require('uuid');
const { registerUser, AddEmployeeRequestToUrm } = require('../services/authService');

const registerEmployee = async(req, res, next) => {
  try{
    const {username, password, fullName, email, department, position, roleName, passwordExpiry } = req.body;

    const newEmployeeId = uuidv4();
    const addEmployeeData = await AddEmployeeRequestToUrm(newEmployeeId, fullName, email, department, position, roleName)

    if(!addEmployeeData.success === true){
      return res.status(400).json({error: "Gagal menambahkan data pegawai ke URM"})
    }
    const register = await registerUser(newEmployeeId, username, password, passwordExpiry)
    
    if(!register.success === true){
      return res.status(400).json({error: "Gagal menambahkan data pegawai ke URM"})
    }
    
    return res.status(200).json({message: "Pegawai berhasil didaftarkan"})

  } catch(error) {
    console.error(error)
    return res.status(500).json({error: "Terjadi kesalahan internal server."})
  }
}

module.exports = registerEmployee