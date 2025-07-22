const express = require('express');
const router = express.Router();
const { registerUser,AddEmployeeRequestToUrm } = require('../services/authService');
const authenticateAdmin = require('../middlewares/authenticateAdmin')
const { v4: uuidv4 } = require('uuid');

router.post("/register", authenticateAdmin, async(req, res, next) => {

  if (req.body === undefined){
    return res.status(400).json({message: 'Input tidak valid.'})
  }

  const {username, initialPasswordHashed, fullName, email, department, position, roleName } = req.body;

  if(!username || !initialPasswordHashed || !fullName || !email || !department || !position || !roleName) {
    return res.status(400).json({message: 'Input tidak valid. Data yang diberikan tidak lengkap.'})
  }

  const newEmployeeId = uuidv4();
  
  try{
    const addEmployeeData = await AddEmployeeRequestToUrm(newEmployeeId, fullName, email, department, position, roleName)
    
    if(!addEmployeeData.success === true){
      return res.status(400).json({message: addEmployeeData.message || "Gagal menambah data pegawai ke URM"});
    }
    const register = await registerUser(newEmployeeId, username, initialPasswordHashed)
    
    if(register.success === true){
      res.status(201).json({message: "Pengguna berhasil didaftarkan"})
    }else{
      res.status(400).json({message: result.message || "Gagal mendaftarkan pengguna"})
    }
    res.status(200).json({message: "Req success"})
  } catch(error) {
    res.status(500).json({message: "Terjadi kesalahan internal server."})
  }
});

module.exports = router