const registerUser = async (employeeId, username, password) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({success: true, message: "User registered successfully"});
    }, 500);
  });
};

const getEmployeeById = async (employeeId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const users = { //inconsistent naming scheme
        'admin_user_id_123': { id: 'admin_user_id_123', role: 'admin', username: 'adminuser' },
        'normal_user_id_456': { id: 'normal_user_id_456', role: 'user', username: 'john_doe' }
      };
      resolve(users[employeeId])
    }, 100);
  });
};

module.exports = {registerUser, getEmployeeById}