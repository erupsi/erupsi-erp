const express = require('express');
const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');
const { sequelize, Shift, Attendance } = require('../models');
const { QueryTypes, Op } = require('sequelize');
const { getUsersByIds } = require('../services/userService');

const reportsController = {
    getPayrollSummary: async (req, res) => {
        try {
            const { start_date, end_date } = req.query;

            if (!start_date || !end_date) {
                return res.status(400)
                    .json({ error: 'Parameter start_date dan end_date diperlukan.' });
            }

            const summaryDb = await sequelize.query(
                `SELECT
                    employee_id,
                    SUM(EXTRACT(EPOCH FROM (check_out - check_in))) / 3600 AS total_hours
                 FROM attendances
                 WHERE check_in >= :start_date AND check_out <= :end_date AND check_out IS NOT NULL
                 GROUP BY employee_id`,
                {
                    replacements: { start_date, end_date },
                    type: QueryTypes.SELECT,
                },
            );

            if (summaryDb.length === 0) {
                return res.status(200).json([]);
            }

            const employeeIds = summaryDb.map((item) => item.employee_id);
            const employees = await getUsersByIds(employeeIds);
            const employeeMap = new Map(employees.map((emp) => [emp.id, emp.full_name]));

            const finalSummary = summaryDb.map((item) => ({
                employee_id: item.employee_id,
                full_name: employeeMap.get(item.employee_id) || 'Nama Tidak Ditemukan',
                total_hours: parseFloat(item.total_hours).toFixed(2),
            }));

            res.status(200).json(finalSummary);
        } catch (error) {
            console.error('Gagal mengambil rekapitulasi payroll:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    getWorkContextForIncident: async (req, res) => {
        try {
            const { employee_id, incident_timestamp } = req.query;

            if (!employee_id || !incident_timestamp) {
                return res.status(400)
                    .json({ error: 'Parameter employee_id dan incident_timestamp diperlukan.' });
            }

            const incidentDate = new Date(incident_timestamp);
            const incidentDay = incidentDate.toISOString().split('T')[0];

            const shift = await Shift.findOne({
                where: { employee_id: employee_id, shift_date: incidentDay },
            });

            const attendance = await Attendance.findOne({
                where: {
                    employee_id: employee_id,
                    check_in: { [Op.lte]: incidentDate },
                    check_out: { [Op.or]: [null, { [Op.gte]: incidentDate }] },
                },
            });

            res.status(200).json({
                employee_id,
                incident_timestamp,
                shift_details: shift,
                attendance_record: attendance,
            });
        } catch (error) {
            console.error('Gagal mengambil konteks kerja:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
};

router.get(
    '/payroll-summary',
    // authenticateToken,
    reportsController.getPayrollSummary,
);

router.get(
    '/work-context',
    // authenticateToken,
    reportsController.getWorkContextForIncident,
);

module.exports = router;
