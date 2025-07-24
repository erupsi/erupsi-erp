const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeManager } = require('../middleware/auth');

const leaveRequestController = {
    createLeaveRequest: (req, res) => res.status(201).send("Leave request submitted"),
    getTeamLeaveRequest: (req, res) => res.status(200).json([]),
    updateLeaveRequestStatus: (req, res) => res.status(200).send(`Leave request ${req.params.id} updated`)
};

//middleware untuk autentiksi
router.use(authenticateToken);

//endpoint untuk ajuan cuti dari karyawan 
router.post("/", leaveRequestController.createLeaveRequest);

//endpoint untuk manager melihat ajuan cuti 
router.get("/team", authorizeManager, leaveRequestController.getTeamLeaveRequest);

//endpoint untuk manajer menyetujui atau menolak pengajuan
router.put("/:id/status", authorizeManager, leaveRequestController.updateLeaveRequestStatus);

module.exports = router;