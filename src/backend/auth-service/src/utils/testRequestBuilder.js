const requestBuilder = require('./requestBuilder')

const test = async (employeeId) => {
  const response = await requestBuilder(`http://localhost:3001/urm/employee/${employeeId}`, 'GET')
  console.log(response)
}

test('ba3a8528-256c-43e3-909a-da71aaff690a')