import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    age: "",
  });

  // Editing state
  const [editingId, setEditingId] = useState(null);

  // GET students
  useEffect(() => {
    axios
      .get("https://vergara-a-prac-exam-server.vercel.app/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // Store input values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      name: student.name,
      course: student.course,
      age: student.age,
    });
  };

  // Add or Update student
  const handleSubmit = (e) => {
    e.preventDefault();

    // UPDATE
    if (editingId) {
      axios
        .put(
          `https://vergara-a-prac-exam-server.vercel.app/students/${editingId}`,
          formData
        )
        .then((response) => {
          setStudents(
            students.map((student) =>
              student._id === editingId
                ? response.data.student
                : student
            )
          );

          // Clear form
          setFormData({
            name: "",
            course: "",
            age: "",
          });

          setEditingId(null);

          alert("Student updated successfully");
        })
        .catch((error) => {
          console.error("Error updating student:", error);
          alert("Error updating student");
        });
    } else {
      // ADD
      axios
        .post(
          "https://vergara-a-prac-exam-server.vercel.app/students",
          formData
        )
        .then((response) => {
          setStudents([
            ...students,
            response.data.student,
          ]);

          // Clear form
          setFormData({
            name: "",
            course: "",
            age: "",
          });

          alert("Student added successfully");
        })
        .catch((error) => {
          console.error("Error adding student:", error);
          alert("Error adding student");
        });
    }
  };

  // Delete student
  const handleDelete = (id) => {
    axios
      .delete(
        `https://vergara-a-prac-exam-server.vercel.app/students/${id}`
      )
      .then(() => {
        setStudents(
          students.filter((student) => student._id !== id)
        );

        alert("Student deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
        alert("Error deleting student");
      });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);

    setFormData({
      name: "",
      course: "",
      age: "",
    });
  };

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>
        {editingId ? "Edit Student" : "Add Student"}
      </h2>

      {/* ADD / EDIT FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Student Name"
          value={formData.name}
          onChange={handleChange}
          minLength="3"
          required
        />

        <br />

        <input
          type="text"
          name="course"
          placeholder="Enter Course Name"
          value={formData.course}
          onChange={handleChange}
          minLength="2"
          required
        />

        <br />

        <input
          type="number"
          name="age"
          placeholder="Enter Age"
          value={formData.age}
          onChange={handleChange}
          required
        />

        <br />

        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>

        {/* Show Cancel only when editing */}
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </form>

      <br />

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button
            type="button"
            onClick={() => handleEdit(student)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => handleDelete(student._id)}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;