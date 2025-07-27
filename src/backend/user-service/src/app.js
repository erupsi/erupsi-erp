const express = require("express");
const urmRoutes = require("./routes/urm.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use("/urm", urmRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the URM Service');
});

app.listen(PORT, () => {
    console.log(`urm app listening on port ${PORT}`);
});
