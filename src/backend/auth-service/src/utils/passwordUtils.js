const bcrypt = require('bcrypt');

const bcryptSalting = async (plainPassword) => {
  try{
  const saltRounds = 10;
  const storedHash = await bcrypt.hash(plainPassword, saltRounds);
  return storedHash
  } catch(error){
    return
  }
}

const comparator = async (plainPassword, hashedPassword) => {
  try{
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
    return isMatch
  } 
  catch(error){
    console.error(error)
    return false
  }
}

module.exports = {bcryptSalting, comparator}