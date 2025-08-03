const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IncidentReport = sequelize.define('IncidentReport', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    employee_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    incident_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    reported_by: {
        type: DataTypes.UUID,
        allowNull: false,
    },
}, {
    tableName: 'incident_reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = IncidentReport;
