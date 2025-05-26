import React, { useState, useEffect } from 'react';
import axiosClient from "../../axios-client.jsx";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import '../styles/ClassAttendance.css';

const ViewAttendance = () => {
  const [students, setStudents] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [date, setDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const { setNotification } = useStateContext();

  useEffect(() => {
    // Fetch the list of students from the backend
    axiosClient
      .get('/students')
      .then(({ data }) => {
        setStudents(data.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  }, []);

  const handleClassChange = (classValue) => {
    setSelectedClass(classValue);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSubmit = () => {
    if (!date || !selectedClass) {
      setNotification("Please select both class and date.");
      return;
    }

    // Fetch attendance data for the selected class and date
    axiosClient.get(`/attendance/view-class/${selectedClass}/${date}`)
      .then(response => {
        console.log(response.data.attendance);
        setFilteredAttendance(response.data.attendance);
      })
      .catch(error => {
        console.error("Error fetching attendance data:", error);
        setNotification("Error fetching attendance.");
      });
  };

  return (
    <div className="attendance-container">
      <h1 className="page-title">View Class Attendance</h1>

      <div className="controls">
        <div className="date-input">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="date-picker"
          />
        </div>

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

      <button className="submit-btn" onClick={handleSubmit}>View Attendance</button>

      <h2>Attendance for {selectedClass} on {date}:</h2>
      {filteredAttendance.length > 0 ? (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(attendance => (
              <tr key={attendance.student_id}>
                <td>{attendance.student_id}</td>
                <td>{attendance.student_name}</td>
                <td>{attendance.status ? 'Present' : 'Absent'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance data available for this class and date.</p>
      )}
    </div>
  );
};

export default ViewAttendance;
