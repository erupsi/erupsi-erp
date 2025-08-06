const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    check_in: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    check_out: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('on_time', 'late', 'absent'),
        allowNull: false,
    },
    duration_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
}, {
    tableName: 'attendances',
    timestamps: false,
});

module.exports = Attendance;
