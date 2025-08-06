const express = require('express');
const router = express.Router();
// const {authenticateToken, authorizeManager} = require("../middleware/auth");
const { LeaveRequest, Shift } = require('../models'); // <-- Perbarui ini
const { Op } = require('sequelize');
const { getTeamMemberIds } = require('../services/userService');

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

            if (new Date(end_date) < new Date(start_date)) {
                return res.status(400)
                    .json({ error: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' });
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
            const managerId = '4a7c6c4a-8d4e-4b9f-9c7e-2a1b3d5f6a7b';
            const teamMemberIds = await getTeamMemberIds(managerId);

            const requests = await LeaveRequest.findAll({
                where: {
                    employee_id: teamMemberIds,
                },
            });

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
            const { id } = req.params;
            // Ambil rejection_reason dari body
            const { status, rejection_reason } = req.body;
            const managerIdForTesting = '4a7c6c4a-8d4e-4b9f-9c7e-2a1b3d5f6a7b';

            if (!status || !['approved', 'rejected'].includes(status)) {
                return res.status(400).json({ error: 'Status tidak valid.' });
            }

            const requestToUpdate = await LeaveRequest.findByPk(id);

            if (!requestToUpdate) {
                return res.status(404).json({ error: 'Pengajuan cuti tidak ditemukan.' });
            }

            // --- LOGIKA VALIDASI MANAJER ---
            const teamMemberIds = await getTeamMemberIds(managerIdForTesting);
            if (!teamMemberIds.includes(requestToUpdate.employee_id)) {
                return res.status(403)
                    .json({ error: 'Akses ditolak: Anda bukan manajer dari karyawan ini.' });
            }
            // --- AKHIR LOGIKA VALIDASI ---

            requestToUpdate.status = status;
            // Jika ditolak, simpan alasannya
            if (status === 'rejected') {
                requestToUpdate.rejection_reason = rejection_reason || null;
            }

            await requestToUpdate.save();

            if (status === 'approved') {
                await Shift.update(
                    { status: 'on_leave' },
                    {
                        where: {
                            employee_id: requestToUpdate.employee_id,
                            shift_date: {
                                [Op.between]: [requestToUpdate.start_date, requestToUpdate.end_date],
                            },
                        },
                    },
                );
            }


            res.status(200).json({
                message: `Status pengajuan cuti berhasil diubah menjadi ${status}`,
                data: requestToUpdate,
            });
        } catch (error) {
            console.error('Gagal memperbarui status pengajuan cuti:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
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
