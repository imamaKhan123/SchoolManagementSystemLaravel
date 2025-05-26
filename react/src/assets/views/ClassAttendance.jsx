import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.jsx";
import '../styles/ClassAttendance.css';

const ClassAttendance = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');
  const [selectedClass, setSelectedClass] = useState(''); // New state for class selection
  const {  setNotification } = useStateContext();

  useEffect(() => {
    // Fetch the list of students from the backend (students with user_id)
    axiosClient
      .get('/students')
      .then(({ data }) => {
        // console.log(data);
        setStudents(data.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  }, []);

  const handleClassChange = (classValue) => {
    setSelectedClass(classValue);

    // Filter students based on selected class
    const filtered = students.filter(student => student.grade === classValue);
    setFilteredStudents(filtered);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prevState => ({
      ...prevState,
      [studentId]: status,
    }));
  };

  const handleSubmit = () => {
    if (!date) {
        setNotification("Please select a date.");
      return;
    }

    const attendanceData = Object.keys(attendance).map(studentId => ({
      student_id: studentId,
      date: date,
      status: attendance[studentId] ? 1 : 0, // true: 1 (present), false: 0 (absent)
    }));
// console.log(attendanceData);
    axiosClient.post('attendance/mark-class', { attendance: attendanceData })
      .then(response => {
        setNotification('Attendance marked successfully!');
        const interval = setInterval(() => {
            window.location.reload();
          }, 3000); 
     

      })
      .catch(error => {
        console.error('There was an error marking the attendance!', error);
        setNotification('Error marking attendance.');
      });
  };

  return (
    <div className="attendance-container">
      <h1 className="page-title">Mark Class Attendance</h1>

      <div className="controls">
        <div className="date-input">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-picker"
          />
        </div>
 &nbsp;
        <div className="class-select">
          <label>Select Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => handleClassChange(e.target.value)}
            className="class-dropdown"
          >
            <option value="">--Select Class--</option>
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
            <option value="D">Class D</option>
          </select>
        </div>
      </div>

      <h2>Students:</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          {(selectedClass ? filteredStudents : students).map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  value="present"
                  checked={attendance[student.id] === true}
                  onChange={() => handleAttendanceChange(student.id, true)}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  value="absent"
                  checked={attendance[student.id] === false}
                  onChange={() => handleAttendanceChange(student.id, false)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="submit-btn" onClick={handleSubmit}>Submit Attendance</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ClassAttendance;
