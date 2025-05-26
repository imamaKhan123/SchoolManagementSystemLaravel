import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.jsx";
import { useNavigate, useParams} from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

function MarkAttendance() {
  const { studentId } = useParams();  // Use useParams to extract studentId from URL
  const [studentInfo, setStudentInfo] = useState({ name: "", grade: "" , id:""}); // State to store student info
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState(true);
  const {setNotification} = useStateContext()

  const submitAttendance = () => {
    axiosClient.post(`/attendance/mark/${studentId}`,{ student_id: studentInfo.id, date, status })
      .then(({ data }) => {
        // alert(data.message);
        setNotification('User was successfully updated')
        // navigate('/users')
        navigate(-1);
      })
      .catch(err => {
        console.error("Error marking attendance:", err);
      });
  };

 // Fetch student info on component load
 useEffect(() => {
  axiosClient.get(`/students/${studentId}`)
    .then(({ data }) => {
      setStudentInfo({ name: data.data.name, grade: data.data.grade, id:data.data.id });
      // console.log(data.data);
    })
    .catch(err => {
      console.error("Error fetching student info:", err);
    });
}, [studentId]);


  return (
    <div>
      <h2>Mark Attendance</h2>
      <h5  >Student ID: {studentInfo.id} </h5>
  
      <h5  >Student Name: {studentInfo.name} </h5>
    
     <h5 >Class or Grade: {studentInfo.grade}</h5>
     &nbsp;
   
    <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <select value={status} onChange={e => setStatus(e.target.value === "true")}>
        <option value={true}>Present</option>
        <option value={false}>Absent</option>
      </select>
      &nbsp;
      <button onClick={submitAttendance}>Submit</button>
    </div>
  );
}

export default MarkAttendance;
