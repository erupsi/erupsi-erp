const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeManager } = require('../middleware/auth');
const Shift = require('../models/shift'); // Impor model Shift

const shiftController = {
    // FUNGSI YANG HILANG SEBELUMNYA
    createShift: async (req, res) => {
        try {
            const { employee_id, shift_date, start_time, end_time } = req.body;
            if (!employee_id || !shift_date || !start_time || !end_time) {
                return res.status(400).json({ error: 'Input tidak lengkap.' });
            }
            const newShift = await Shift.create({
                employee_id,
                shift_date,
                start_time,
                end_time,
            });
            res.status(201)
                .json({ message: 'Shift berhasil dibuat', data: newShift });
        } catch (error) {
            console.error('Gagal membuat shift:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    // FUNGSI YANG HILANG SEBELUMNYA
    getShifts: async (req, res) => {
        try {
            const shifts = await Shift.findAll();
            res.status(200).json(shifts);
        } catch (error) {
            console.error('Gagal mengambil data shift:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    // FUNGSI UPDATE ANDA (SUDAH BENAR)
    updateShift: async (req, res) => {
        try {
            const { id } = req.params;
            const { employee_id, shift_date, start_time, end_time } = req.body;
            const shiftToUpdate = await Shift.findByPk(id);
            if (!shiftToUpdate) {
                return res.status(404).json({ error: 'Shift tidak ditemukan.' });
            }
            shiftToUpdate.employee_id = employee_id || shiftToUpdate.employee_id;
            shiftToUpdate.shift_date = shift_date || shiftToUpdate.shift_date;
            shiftToUpdate.start_time = start_time || shiftToUpdate.start_time;
            shiftToUpdate.end_time = end_time || shiftToUpdate.end_time;
            await shiftToUpdate.save();
            res.status(200).json({
                message: 'Shift berhasil diperbarui',
                data: shiftToUpdate,
            });
        } catch (error) {
            console.error('Gagal memperbarui shift:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    // FUNGSI DELETE ANDA (SUDAH BENAR)
    deleteShift: async (req, res) => {
        try {
            const { id } = req.params;
            const shiftToDelete = await Shift.findByPk(id);
            if (!shiftToDelete) {
                return res.status(404).json({ error: 'Shift tidak ditemukan.' });
            }
            await shiftToDelete.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Gagal menghapus shift:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
};

router.post(
    '/',
    // authenticateToken,  // <-- Dinonaktifkan sementara
    // authorizeManager,   // <-- Dinonaktifkan sementara
    shiftController.createShift,
);
router.get(
    '/',
    // authenticateToken,  // <-- Dinonaktifkan sementara
    shiftController.getShifts,
);
router.put(
    '/:id',
    // authenticateToken,  // <-- Dinonaktifkan sementara
    // authorizeManager,   // <-- Dinonaktifkan sementara
    shiftController.updateShift,
);
router.delete(
    '/:id',
    // authenticateToken,  // <-- Dinonaktifkan sementara
    // authorizeManager,   // <-- Dinonaktifkan sementara
    shiftController.deleteShift,
);
module.exports = router;
