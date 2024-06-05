require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const connection = require('./db');
connection();

// Route imports
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// Route middleware
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`));
