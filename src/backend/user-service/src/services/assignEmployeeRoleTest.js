const {assignEmployeeWithRoles} = require('./urmService')

const test1 = async () => {
  const result = await assignEmployeeWithRoles("ba3a8528-256c-43e3-909a-da71aaff690a",["SYSTEM_ADMIN", "BACKEND_ENGINEER"] )
  if(!result.success){
    console.log("GAGAL", result.message)
  }
    console.log("Berhasil")
}

test1()