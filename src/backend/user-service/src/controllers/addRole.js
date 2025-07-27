const { v4: uuidv4 } = require('uuid');
const {insertRoleToDb, findRoleByName} = require('../services/urmService');

const addRole = async(req, res) => {
  //check if role is in a valid format (all string)
  // check if the parameter(name, display name, description) is enough)
  //check if role exist based on name
  //generate uuid
  //insert roles to db
  const roleData = req.body;
  const {name, display_name, description} = roleData
  const existingRole = await findRoleByName(name)

  if(existingRole.length > 0) {
    return res.status(409).json({error: "Role sudah ada"})
  }

  const newRoleId = uuidv4();

  try{
    const result = await insertRoleToDb(newRoleId, name, display_name, description)
    if(!result.success){
      return res.status(400).json({error: result.message})
    }
    return res.status(200).json({message: "Berhasil menambahkan role"})
  }catch(error){
    console.error(error)
    return res.status(500).json({error: "Terjadi kesalahan internal server"})
  }

}

module.exports = addRole