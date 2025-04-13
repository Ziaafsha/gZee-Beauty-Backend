const express = require("express");
const app = express();
const port = 2000;

const router = require("./route");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use("/api",router);

app.listen(port, () => console.log(`SERVER STARTED ${port}`));