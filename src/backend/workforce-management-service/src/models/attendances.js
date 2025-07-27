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
        type: DataTypes.DATE, // Menggunakan DATE (TIMESTAMP) untuk waktu dan tanggal
        allowNull: false,
    },
    check_out: {
        type: DataTypes.DATE,
        allowNull: true, // check_out bisa null saat karyawan baru check-in
    },
    status: {
        type: DataTypes.ENUM('on_time', 'late', 'absent'),
        allowNull: false,
    },
    duration_hours: {
        type: DataTypes.DECIMAL(5, 2), // Precision 5, scale 2 (misal: 123.45 jam)
        allowNull: true,
    },
}, {
    tableName: 'attendances',
    timestamps: false, // Tabel ini tidak memerlukan created_at/updated_at
});

module.exports = Attendance;
