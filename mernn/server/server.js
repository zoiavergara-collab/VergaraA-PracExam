const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    isConnected = false;
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.get("/db-test", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      status: "success",
      message: "MongoDB connection is working",
      readyState: mongoose.connection.readyState,
    });
  } catch (error) {
    console.error("DB TEST ERROR:", error);

    res.status(500).json({
      status: "error",
      message: "MongoDB connection failed",
      error: error.message,
      readyState: mongoose.connection.readyState,
    });
  }
});

app.get("/students", async (req, res) => {
  try {
    await connectDB();

    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    console.error("Error getting students:", error);

    res.status(500).json({
      message: "Error getting students",
      error: error.message,
    });
  }
});

app.post("/students", async (req, res) => {
  try {
    await connectDB();

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
    console.error("Error adding student:", error);

    res.status(400).json({
      message: "Error adding student",
      error: error.message,
    });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    await connectDB();

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
    console.error("Error updating student:", error);

    res.status(400).json({
      message: "Error updating student",
      error: error.message,
    });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await connectDB();

    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    res.status(500).json({
      message: "Error deleting student",
      error: error.message,
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;