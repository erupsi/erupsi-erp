const bcrypt = require('bcrypt');

const bcryptSalting = async (plainPassword) => {
  const saltRounds = 10;
  const storedHash = await bcrypt.hash(plainPassword, saltRounds);
  return storedHash
}

const comparator = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
  return isMatch
}

module.exports = {bcryptSalting, comparator}