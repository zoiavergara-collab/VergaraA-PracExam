const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MONGODB CONNECTION ERROR:", err.message);
  });

// Test Server Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// MongoDB Connection Test
app.get("/db-test", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      status: "success",
      message: "MongoDB connection is working",
    });
  } catch (error) {
    console.error("DB TEST ERROR:", error);

    res.status(500).json({
      status: "error",
      message: "MongoDB connection failed",
      error: error.message,
    });
  }
});

// Add New Student
app.post("/students", async (req, res) => {
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
    console.error("Add student error:", error);

    res.status(400).json({
      message: "Error adding student",
      error: error.message,
    });
  }
});

// Get All Students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    console.error("Get students error:", error);

    res.status(500).json({
      message: "Error getting students",
      error: error.message,
    });
  }
});

// Delete Student
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  }
});

// Update Student
app.put("/students/:id", async (req, res) => {
  try {
    const { name, course, age } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        course,
        age,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Update student error:", error);

    res.status(400).json({
      message: "Error updating student",
      error: error.message,
    });
  }
});

// Run Locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Vercel
module.exports = app;