import { useEffect, useState } from "react";
import axios from "axios";

function App() {
const [students, setstudents] = useState([])

  //get 
useEffect(() => {
 
  axios
      .get("http://localhost:5000/students")
      .then((response) => {
       setstudents(response.data);
      });
  }, []);
//store input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  };

  //ADD
  const handleSubmit = (e) => {
    e.preventDefault();

    // UPDATE
    if (editingId) {
      axios
        .put(
          `http://localhost:5000/students/${editingId}`,
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

          // Exit editing mode
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
        .post("http://localhost:5000/students", formData)
        .then((response) => {
          setStudents([
            ...students,
            response.data.student
          ]);

          // Clear form
          setFormData({
            name: "",
            course: "",
            age: ""
          });

          alert("Student added successfully");
        })
        .catch((error) => {
          console.error("Error adding student:", error);
          alert("Error adding student");
        });
    }
  };


  return (
    <div>
      <h1>Student Management System</h1>
        <h2>Students</h2>
    
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
       </form>
       
       
       
       
       
       
       
        {students.map((student) =>(
         
         <div key = {students.id}>
            <p>Name: {student.name}</p>
             <p>Course: {student.course}</p>
              <p>Age: {student.age}</p>
            </div>
        )
        )
        }
    </div>
  );
}

export default App;
