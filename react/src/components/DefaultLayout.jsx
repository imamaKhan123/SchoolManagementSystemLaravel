import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client.jsx";
import { useEffect, useState } from "react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [Id, setId] = useState(null);
  // Logout handler
  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  // Fetch user data
  useEffect(() => {
    if (!token) return; // Ensure the effect only runs if a token exists

    axiosClient
      .get("/user")
      .then(({ data }) => {
        setUser(data); // Update the user state
       console.log(data);
        if (data.role === "student") {
          // If the user is a student, fetch student-specific data
          fetchStudentData(data.id);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [token]); // Add `token` as a dependency to prevent running after logout

  // Fetch student data
  const fetchStudentData = (id) => {
    axiosClient
      .get(`/student/${id}`)
      .then((response) => {
        setId(response.data.data.id);
        // console.log(response)
      })
      .catch((err) => {
        console.error("Error fetching student profile:", err);
      });
  };

  // Redirect to login if token is missing
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div id="defaultLayout">
      <aside>
        {user.role === "Admin" || user.role === "admin" || user.designation != 'abc'? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/messages">Messages</Link>
            <Link to="/users">Users</Link>
            <Link to="/teachers">Teachers</Link>
            <Link to="/teacher-dashboard">Teachers Dashboard</Link>
            <Link to="/students">Students</Link>
            <Link to="/mark-attendence">Mark Attendence</Link>
            <Link to="/view-attendence">View Attendence</Link>
          </>
        ) : null}
        {user.designation === "Student" ? (
          <>
          <Link to={`/dashboard`}>Dashboard</Link>
            <Link to={`/show-profile/${Id}`}>Show Profile</Link>
            <Link  to={`/show-courses/${Id}`}> Courses</Link>
            <Link to={`/upload/${Id}`}> Upload Files</Link>
            <Link to="/messages">Messages</Link>    
            <Link  to={`/enroll-student/${Id}`}>Enroll</Link>
            <Link to={`/view-attendence/${Id}`}>View Attendance</Link>
          </>
        ):null}
         {user.designation === "Teacher" ? (
          <>
           <Link to="/teacher-dashboard">Teachers Dashboard</Link>
            <Link to={`/show-teacher-profile/${user.id}`}>Show Profile</Link>
            <Link  to={`/show-courses/${user.id}`}> Courses</Link>
            <Link to="/students">Students</Link>
            <Link to="/messages">Messages</Link>    
            <Link to="/mark-attendence">Mark Attendence</Link>
            <Link to={`/view-attendence/${Id}`}>View Attendance</Link>
          </>
        ):null}
      </aside>
      <div className="content">
        <header>
          <div>School Management System</div>

          <div>
            {user.name} &nbsp; 
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}
