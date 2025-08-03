require('dotenv').config({ path: '../../../.env' });
const express = require('express');
const { sequelize } = require('./models'); // <-- Diperbarui
const cors = require('cors');

const shiftsRoutes = require('./routes/shifts');
const leaveRequestRoutes = require('./routes/leave_request');
const attendanceRoutes = require('./routes/attendances');
const reportRoutes = require('./routes/reports'); // <-- Baru
const incidentRoutes = require('./routes/incidents');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3003;

app.get('/', (req, res) => {
    res.send('Welcome to the Workforce Management Service!');
});

app.use('/shifts', shiftsRoutes);
app.use('/leave-requests', leaveRequestRoutes);
app.use('/attendances', attendanceRoutes);
app.use('/reports', reportRoutes); // <-- Baru
app.use('/incidents', incidentRoutes);

sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
        console.log(`Workforce Management service listening on http://localhost:${port}`);
    });
});
