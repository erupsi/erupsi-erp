const express = require('express');
const router = express.Router();
const { registerUser } = require('../services/authService');
const authenticateAdmin = require('../middlewares/authenticateAdmin')

router.post("/employee", authenticateAdmin, async(req, res, next) => {
   
  const { employeeId, username, initialPassword } = req.body;

  if(!employeeId || !username || !initialPassword) {
    return res.status(400).json({message: 'Input tidak valid. employeeId, username, dan password diperlukan.'})
  }

  try{
    //not fitted with scheme
    const result = await registerUser(username, password)
    if(result.success){
      res.status(201).json({message: "Pengguna berhasil didaftarkan"})
    }else{
      res.status(400).json({message: result.message || "Gagal mendaftarkan pengguna"})
    }
  } catch(error) {
    res.status(500).json({message: "Terjadi kesalahan internal server."})
  }
});

module.exports = router