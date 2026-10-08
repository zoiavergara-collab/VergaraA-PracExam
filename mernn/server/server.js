const express = require("express");
const cors = require("cors")
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});


app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
