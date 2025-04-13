const mysql = require("mysql2");
require("dotenv").config();

// Create MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Handle multiple connections
});

module.exports = pool.promise();
