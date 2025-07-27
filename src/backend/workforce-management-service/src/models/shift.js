// src/backend/workforce-management-service/src/models/shift.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shift = sequelize.define('Shift', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    shift_date: {
        type: DataTypes.DATEONLY, // Tipe data hanya untuk tanggal
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME, // Tipe data hanya untuk waktu
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'on_leave'),
        defaultValue: 'active',
        allowNull: false,
    },
}, {
    tableName: 'shifts',
    timestamps: true, // Otomatis menambahkan kolom createdAt dan updatedAt
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Shift;
