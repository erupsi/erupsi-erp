const { findAllRoles} = require('../services/urmService');

/**
 * Retrieves a list of all available roles.
 * @async
 * @function getAllRoles
 * @param {import('express').Request} req - The Express request object (not used in this handler).
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the list of roles or an error message.
 */

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