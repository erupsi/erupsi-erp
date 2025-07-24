// src/backend/workforce-management-service/src/routes/shifts.js

const express = require("express");
const router = express.Router();

// Impor middleware Anda
const { authenticateToken, authorizeManager } = require('../middleware/auth');

// Definisikan controller di sini untuk sementara
const shiftController = {
    createShift: (req, res) => {
        // Logika untuk membuat shift akan ada di sini
        res.status(201).json({ message: "Shift created successfully for user: " + req.user.user_id });
    },
    getShifts: (req, res) => {
        // Logika untuk mendapatkan shift
        res.status(200).json([]);
    },
    updateShift: (req, res) => {
        res.status(200).json({ message: `Shift ${req.params.id} updated` });
    },
    deleteShift: (req, res) => {
        res.status(204).send();
    }
};

// Terapkan middleware dan controller ke setiap rute
// Pastikan setiap argumen adalah fungsi yang valid
router.post("/", authenticateToken, authorizeManager, shiftController.createShift);
router.get("/", authenticateToken, shiftController.getShifts);
router.put("/:id", authenticateToken, authorizeManager, shiftController.updateShift);
router.delete("/:id", authenticateToken, authorizeManager, shiftController.deleteShift);

module.exports = router;