import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client.jsx";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

function AttendanceHistory() {
  const { studentId } = useParams(); // Extract studentId from the URL
  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState("");   // State for end date
  const {setNotification} = useStateContext()
  // Fetch attendance data
  const fetchAttendance = () => {
    if (startDate && endDate) {
      axiosClient
        .get(`/attendance?student_id=${studentId}&start_date=${startDate}&end_date=${endDate}`)
        .then(({ data }) => {
          setAttendance(data || []);
          // console.log(data);
        })
        .catch((err) => {
          console.error("Error fetching attendance:", err);
        });
    }
  };

  // Delete attendance record
  const onDeleteClick = (record) => {
    if (window.confirm(`Are you sure you want to delete the attendance record for ${record.date}?`)) {
      axiosClient
        .delete(`/attendance/${record.id}`) // Assuming the DELETE endpoint uses the record ID
        .then(() => {
          // Remove the deleted record from the local state
          setAttendance(attendance.filter((item) => item.id !== record.id));
          setNotification("Attendance record deleted successfully.");
        })
        .catch((err) => {
          console.error("Error deleting attendance record:", err);
          setNotification("Failed to delete the attendance record.");
        });
    }
  };


  // Trigger fetchAttendance when startDate or endDate changes
  // useEffect(() => {
  //   fetchAttendance();
  // }, [startDate, endDate]);

  return (
    <div>
      <h2>Attendance History</h2>
      <h3>SID: {studentId}</h3>
      <div>
        <label>
          Start Date: 
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label >
          End Date:  
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchAttendance} className="btn-edit" style={{ marginTop:  "10px" }}>
          Fetch Attendance
        </button>
      </div>
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Created at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance && attendance.length > 0 ? (
            attendance.map((u) => (
              <tr key={u.id}>
                <td>{u.date}</td>
                <td>{u.status ? "Present" : "Absent"}</td>
                <td>{u.created_at}</td>
                <td>
                  <button className="btn-delete" onClick={() => onDeleteClick(u)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No attendance records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceHistory;
