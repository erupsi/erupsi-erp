const express = require('express');
const router = express.Router();
// const {authenticateToken} = require("../middleware/auth");
const { Attendance, Shift } = require('../models');

const attendanceController = {
    // Logika untuk karyawan melakukan check-in
    checkIn: async (req, res) => {
        try {
            // Untuk pengujian lokal, kita gunakan ID statis
            const employeeIdForTesting = 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
            const now = new Date();
            const today = now.toISOString().split('T')[0];

            // 1. Cari jadwal shift karyawan untuk hari ini
            const shift = await Shift.findOne({
                where: {
                    employee_id: employeeIdForTesting,
                    shift_date: today,
                },
            });

            let attendanceStatus = 'on_time'; // Status default

            // 2. Jika ada jadwal, bandingkan waktu check-in
            if (shift) {
                // Menggabungkan tanggal hari ini dengan waktu mulai shift
                const shiftStartTime = new Date(`${today}T${shift.start_time}`);
                // Beri toleransi keterlambatan 5 menit (300,000 milidetik)
                const tolerance = 5 * 60 * 1000;

                if (now.getTime() > shiftStartTime.getTime() + tolerance) {
                    attendanceStatus = 'late';
                }
            } else {
                console.log(`Tidak ada shift untuk karyawan ${employeeIdForTesting} hari ini.`);
            }

            // 3. Buat catatan absensi dengan status yang sudah ditentukan
            const newAttendance = await Attendance.create({
                employee_id: employeeIdForTesting,
                check_in: now,
                status: attendanceStatus,
            });

            res.status(201).json({
                message: `Check-in berhasil dengan status: ${attendanceStatus}`,
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
            const { id } = req.params;
            const employeeIdForTesting = 'c1a2b3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

            const attendanceRecord = await Attendance.findOne({
                where: { id: id, employee_id: employeeIdForTesting },
            });

            if (!attendanceRecord) {
                return res.status(404).json({ error: 'Data check-in tidak ditemukan.' });
            }
            if (attendanceRecord.check_out) {
                return res.status(400).json({ error: 'Anda sudah melakukan check-out.' });
            }

            const checkOutTime = new Date();
            const checkInTime = new Date(attendanceRecord.check_in);

            // --- LOGIKA KALKULASI BARU ---
            const durationInMillis = checkOutTime.getTime() - checkInTime.getTime();
            const durationInHours = durationInMillis / (1000 * 60 * 60);
            // --- LOGIKA KALKULASI SELESAI ---

            attendanceRecord.check_out = checkOutTime;
            attendanceRecord.duration_hours = durationInHours.toFixed(2); // Simpan 2 angka desimal
            await attendanceRecord.save();

            res.status(200).json({
                message: 'Check-out berhasil',
                data: attendanceRecord,
            });
        } catch (error) {
            console.error('Gagal melakukan check-out:', error);
            res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
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
