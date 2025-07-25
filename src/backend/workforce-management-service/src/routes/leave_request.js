const express = require('express');
const router = express.Router();
// const {authenticateToken, authorizeManager} = require("../middleware/auth");
const LeaveRequest = require('../models/leave_request');

const leaveRequestController = {
    /**
     * @param {object} req
     * @param {object} res
     */
    createLeaveRequest: async (req, res) => {
        try {
            // employee_id diambil dari token yang sudah divalidasi
            // const employeeIdFromToken = req.user.user_id;
            const employeeIdForTesting = 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
            const { start_date, end_date, reason } = req.body;

            if (!start_date || !end_date || !reason) {
                return res.status(400)
                    .json({ error: 'Input tidak lengkap.' });
            }

            const newRequest = await LeaveRequest.create({
                employee_id: employeeIdForTesting,
                start_date,
                end_date,
                reason,
            });

            res.status(201)
                .json({
                    message: 'Pengajuan cuti berhasil dibuat',
                    data: newRequest,
                });
        } catch (error) {
            console.error('Gagal membuat pengajuan cuti:', error);
            res.status(500)
                .json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    /**
     * @param {object} req
     * @param {object} res
     */
    getTeamLeaveRequests: async (req, res) => {
        try {
            // TODO: Logika ini memerlukan model Employee untuk mengetahui siapa saja
            // anggota tim dari manajer (req.user.user_id).
            // Untuk sekarang, kita kembalikan semua permintaan yang ada.
            const requests = await LeaveRequest.findAll();
            res.status(200).json(requests);
        } catch (error) {
            console.error('Gagal mengambil data pengajuan cuti tim:', error);
            res.status(500)
                .json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    /**
     * @param {object} req
     * @param {object} res
     */
    updateLeaveRequestStatus: async (req, res) => {
        try {
            const { id } = req.params; // ID dari pengajuan cuti
            const { status } = req.body; // Status baru: "approved" atau "rejected"

            if (!status || !['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ error: 'Status tidak valid.' });
            }

            const requestToUpdate = await LeaveRequest.findByPk(id);

            if (!requestToUpdate) {
                return res.status(404)
                    .json({ error: 'Pengajuan cuti tidak ditemukan.' });
            }

            // TODO: Tambahkan validasi untuk memastikan manajer ini berhak
            // mengubah status permintaan ini (memerlukan model Employee).

            requestToUpdate.status = status;
            await requestToUpdate.save();

            res.status(200).json({
                message: `Status pengajuan cuti berhasil diubah menjadi ${status}`,
                data: requestToUpdate,
            });
        } catch (error) {
            console.error('Gagal memperbarui status pengajuan cuti:', error);
            res.status(500)
                .json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
};

router.post(
    '/',
    // authenticateToken,
    leaveRequestController.createLeaveRequest,
);

router.get(
    '/team',
    // authenticateToken,
    // authorizeManager,
    leaveRequestController.getTeamLeaveRequests,
);

router.put(
    '/:id/status',
    // authenticateToken,
    // authorizeManager,
    leaveRequestController.updateLeaveRequestStatus,
);

module.exports = router;
