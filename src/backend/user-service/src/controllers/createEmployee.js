const {insertEmployeeDetailsToDb} = require('../services/urmService');

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