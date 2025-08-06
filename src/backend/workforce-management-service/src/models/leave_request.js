const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
    },
    rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true, // Alasan hanya ada jika ditolak
    },
}, {
    tableName: 'leave_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = LeaveRequest;
