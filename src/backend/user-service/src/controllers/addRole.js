const { v4: uuidv4 } = require('uuid');
const {insertRoleToDb, findRoleByName} = require('../services/urmService');
/**
 * Controller to handle adding a new role.
 * 
 * This function performs the following steps:
 * 1. Checks if a role with the same name already exists in the database.
 * 2. Generates a new UUID for the role.
 * 3. Inserts the new role into the database.
 * 4. Returns appropriate HTTP responses based on the operation's success or failure.
 * 
 * @async
 * @function addRole
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing role data.
 * @param {string} req.body.name - The unique name of the role.
 * @param {string} req.body.display_name - The display name of the role.
 * @param {string} req.body.description - A description of the role.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} Returns an HTTP response with a success or error message.
 * 
 * @throws {Error} If an unexpected error occurs during the operation.
 */


const addRole = async(req, res) => {
  const roleData = req.body;
  const {name, display_name, description} = roleData
  
  try{
    const existingRole = await findRoleByName(name)

    if(existingRole.length > 0) {
      return res.status(409).json({error: "Role sudah ada"})
    }

    const newRoleId = uuidv4();
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