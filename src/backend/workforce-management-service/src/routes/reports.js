const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const reportsController = {
    getPayrollSummary: async (req, res) => {
        try {
            const { start_date, end_date } = req.query;

            if (!start_date || !end_date) {
                return res.status(400)
                    .json({ error: 'Parameter start_date dan end_date diperlukan.' });
            }

            // Ini adalah contoh Raw Query menggunakan Sequelize untuk perhitungan
            // Ini lebih efisien untuk kalkulasi kompleks daripada menggunakan ORM biasa
            const summary = await sequelize.query(
                `SELECT
                    employee_id,
                    SUM(EXTRACT(EPOCH FROM (check_out - check_in))) / 3600 AS total_hours
                 FROM
                    attendances
                 WHERE
                    check_in >= :start_date AND check_out <= :end_date
                 GROUP BY
                    employee_id`,
                {
                    replacements: { start_date, end_date },
                    type: QueryTypes.SELECT,
                },
            );

            res.status(200).json(summary);
        } catch (error) {
            console.error('Gagal mengambil rekapitulasi payroll:', error);
            res.status(500)
                .json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
};

router.get(
    '/payroll-summary',
    // authenticateToken, // Dinonaktifkan sementara untuk pengujian
    reportsController.getPayrollSummary,
);

module.exports = router;
