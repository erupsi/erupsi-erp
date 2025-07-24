const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const attendancesController = {
    checkIn: (req, res) => res.status(201).send(`Check in successful for attendances ID ${req.params.id}`),
    checkOut: (req, res) => res.status(200).send(`Check out successful for attendances ID ${req.params.id}`),
    getHistory: (req, res) => res.status(200).json([])
};

//middleware untuk autentikasi
router.use(authenticateToken);

//endpoint untuk karyawan melakukan check-in
router.post("/check-in/:id", attendancesController.checkIn);

//endpoint untuk karyawan melakukan check-out
router.put("/check-out/:id", attendancesController.checkOut);

//endpoint untuk karyawan melihat history absensin/attendances
router.get("/history", attendancesController.getHistory);

module.exports = router;