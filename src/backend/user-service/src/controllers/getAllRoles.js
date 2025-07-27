const { findAllRoles} = require('../services/urmService');

const getAllRoles = async (req,res) => {

  try{
    const result = await findAllRoles()

    return res.status(200).json({success: true, data: result})

  }catch(error){
    console.error('Error in GET /urm/roles', error.message); // Log the error for debugging
    res.status(500).json({ error: "Internal server error."});
  }
}

module.exports = getAllRoles