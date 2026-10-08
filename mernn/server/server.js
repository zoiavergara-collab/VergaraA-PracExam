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

//create
app.post("/api/students", async (req, res) => {
  try {
    const { name, course, age } = req.body;

    const newStudent = new Student({
      name,
      course,
      age,
      
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student added successfully",
      student: newStudent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding student",
      error: error.message,
    });
  }
});


app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

























app.listen(5000, () => {
    console.log("Server running on port 5000");
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
