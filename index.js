const express = require("express");
const cors = require('cors');
const app = express();
const port = 2000;

const router = require("./route");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api",router);


app.listen(port, () => console.log(`SERVER STARTED ${port}`));