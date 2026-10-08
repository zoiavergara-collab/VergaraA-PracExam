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


  //ADD


  return (
    <div>
      <h1>Student Management System</h1>
        <h2>Students</h2>
     <form onSubmit={handleSubmit}>
      <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            
            />
            <input
              type="num"
              name="age"
              placeholder="Enter Age "
              value={formData.age}
              onChange={handleChange}
            />
             <input
              type="text"
              name="course"
              placeholder="Enter Course"
              value={formData.course}
              onChange={handleChange}
            />

             <button type="submit" className="submit-btn">
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
