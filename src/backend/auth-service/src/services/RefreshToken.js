// const {replaceRefreshTokenFromDB} = require('../services/authService')
const jwt = require('jsonwebtoken');
const pool = require('./db');
const crypto = require('crypto');
require('dotenv').config({ path: __dirname + '/../../.env' })

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

const tokenBuilderAssigner = async (res, employeeId, username, roles, options = {replace_token: false}) => {
  try{
    //buat token
      const accessToken = jwt.sign(
      { employeeId: employeeId, username: username, roles: roles },
      PRIVATE_KEY,
      { algorithm: 'RS256', expiresIn: '15m', issuer:"auth-service" }
      )

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 8);

    const refreshToken = crypto.randomBytes(64).toString('hex');

    if(options.replace_token == true){
      const replaceResult = await module.exports.replaceRefreshTokenFromDB(employeeId, refreshToken, expiryDate)

      if(!replaceResult){
        return res.status(500).json("Internal Server Error");
      }
    }

    return {accessToken, refreshToken}
  }catch(error){
    return res.status(500).json({error: "Internal Server Error"});
  }
}

const replaceRefreshTokenFromDB = async (employeeId, refreshToken, expiresAt) => {
  try{  
    await pool.query('DELETE FROM refresh_tokens WHERE employee_id = $1;', [employeeId]);

    await pool.query(
      'INSERT INTO refresh_tokens (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)',
      [refreshToken, employeeId, expiresAt]
    );
    return true
  } catch(error) {
    console.log(error)
    return false
  }
}

const searchRefreshToken = async(refreshToken) => {
  const sql = `SELECT * FROM refresh_tokens WHERE token_hash = $1;`
  const result = await pool.query(sql, [refreshToken])
  return result.rows
}

const deleteToken = async(token) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [token]);
}

const updateToken = async(employeeId, refreshToken, expiry) => {
  await pool.query('UPDATE refresh_tokens SET token_hash = $1, expires_at = $2 WHERE employee_id = $3', 
    [refreshToken, expiry, employeeId])
}

const invalidateToken = async(tokenId) => {
  await pool.query('UPDATE refresh_tokens SET is_valid = FALSE WHERE id = $1', 
  [tokenId])
}

const deleteTokenByEmpId = async(employeeId) => {
  await pool.query('DELETE FROM refresh_tokens WHERE employee_id = $1', [employeeId]);
}

const insertToken = async (refreshToken, employeeId, expiresAt) => {
  await pool.query('INSERT INTO refresh_tokens (token_hash, employee_id, expires_at) VALUES ($1, $2, $3)',
    [refreshToken, employeeId, expiresAt]
  );
}

const invalidateAndInsertToken = async(tokenId, refreshToken, employeeId, expiresAt) => {
  pool.query("BEGIN")
  try{
    await module.exports.invalidateToken(tokenId)
    await module.exports.insertToken(refreshToken, employeeId, expiresAt)
    pool.query("COMMIT")
  }catch(error){
    pool.query("ROLLBACK")
    console.error(error)
    return error
  }
}

module.exports = {invalidateAndInsertToken, insertToken, invalidateToken, deleteTokenByEmpId, updateToken, deleteToken, tokenBuilderAssigner, replaceRefreshTokenFromDB, searchRefreshToken} 