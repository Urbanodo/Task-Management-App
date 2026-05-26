const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();
app.use("/api/users", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("API Task Manager");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});