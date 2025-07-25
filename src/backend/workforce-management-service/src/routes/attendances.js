const express = require('express');
const router = express.Router();
// const {authenticateToken} = require("../middleware/auth");
const Attendance = require('../models/attendances');

const attendanceController = {
    // Logika untuk karyawan melakukan check-in
    checkIn: async (req, res) => {
        try {
            // const employeeIdFromToken = req.user.user_id;
            const employeeIdForTesting = 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

            // TODO: Tambahkan validasi untuk memastikan karyawan belum check-in hari ini.
            // TODO: Tambahkan logika untuk membandingkan dengan jadwal shift dan menentukan status 'on_time' atau 'late'.

            const newAttendance = await Attendance.create({
                // employee_id: employeeIdFromToken,
                employee_id: employeeIdForTesting,
                check_in: new Date(), // Waktu saat ini
                status: 'on_time', // Placeholder
            });

            res.status(201).json({
                message: 'Check-in berhasil',
                data: newAttendance,
            });
        } catch (error) {
            console.error('Gagal melakukan check-in:', error);
            res.status(500)
                .json({ error: 'Terjadi kesalahan pada server.' });
        }
    },

    // Logika untuk karyawan melakukan check-out
    checkOut: async (req, res) => {
        try {
            const { id } = req.params; // ID dari record absensi yang akan di-update
            const employeeIdFromToken = req.user.user_id;

            const attendanceRecord = await Attendance.findOne({
                where: { id: id, employee_id: employeeIdFromToken },
            });

            if (!attendanceRecord) {
                return res.status(404)
                    .json({ error: 'Data check-in tidak ditemukan.' });
            }

            if (attendanceRecord.check_out) {
                return res.status(400)
                    .json({ error: 'Anda sudah melakukan check-out.' });
            }

            attendanceRecord.check_out = new Date(); // Waktu saat ini
            await attendanceRecord.save();

            res.status(200).json({
                message: 'Check-out berhasil',
                data: attendanceRecord,
            });
        } catch (error) {
            console.error('Gagal melakukan check-out:', error);
            res.status(500)
                .json({ error: 'Terjadi kesalahan pada server.' });
        }
    },
};

router.post(
    '/check-in',
    // authenticateToken,
    attendanceController.checkIn,
);

router.put(
    '/check-out/:id',
    // authenticateToken,
    attendanceController.checkOut,
);


module.exports = router;
