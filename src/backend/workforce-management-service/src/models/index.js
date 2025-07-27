const sequelize = require('../config/database');

const Shift = require('./shift');
const LeaveRequest = require('./leave_request');
const Attendance = require('./attendances');

const db = {
    sequelize,
    Shift,
    LeaveRequest,
    Attendance,
};

module.exports = db;
