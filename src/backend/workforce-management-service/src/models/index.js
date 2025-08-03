const sequelize = require('../config/database');

const Shift = require('./shift');
const LeaveRequest = require('./leave_request');
const Attendance = require('./attendances');
const IncidentReport = require('./incident_reports');

const db = {
    sequelize,
    Shift,
    LeaveRequest,
    Attendance,
    IncidentReport,
};

module.exports = db;
