const express = require('express');
const router = express.Router();
const { IncidentReport } = require('../models');

const incidentController = {
    createIncident: async (req, res) => {
        try {
            const { employee_id, incident_date, description } = req.body;
            // Untuk pengujian lokal, kita gunakan ID pelapor statis
            const reported_by = '4a7c6c4a-8d4e-4b9f-9c7e-2a1b3d5f6a7b';

            if (!employee_id || !incident_date || !description) {
                return res.status(400).json({ error: 'Input tidak lengkap.' });
            }

            const newIncident = await IncidentReport.create({
                employee_id,
                incident_date,
                description,
                reported_by,
            });

            res.status(201).json({ message: 'Laporan insiden berhasil dibuat', data: newIncident });
        } catch (error) {
            console.error('Gagal membuat laporan insiden:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
    getIncidents: async (req, res) => {
        try {
            const incidents = await IncidentReport.findAll();
            res.status(200).json(incidents);
        } catch (error) {
            console.error('Gagal mengambil laporan insiden:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
};

router.post('/', incidentController.createIncident);
router.get('/', incidentController.getIncidents);

module.exports = router;
