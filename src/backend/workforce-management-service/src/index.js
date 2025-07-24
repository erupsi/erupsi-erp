const express = require("express");
const shiftsRoutes = require("./routes/shifts");
const leaveRequestRoutes = require("./routes/leave_request");
const attendanceRoutes = require("./routes/attendances");

const app = express();
app.use(express.json());

const port = 3003;

app.get("/", (req, res) => {
    res.send("Welcome to the Workforce Management Service!");
});

app.use("/shifts", shiftsRoutes);
app.use("/leave-requests", leaveRequestRoutes);
app.use("/attendances", attendanceRoutes); 

app.listen(port, () => {
    console.log(`Workforce Management service listening on http://localhost:${port}`);
});