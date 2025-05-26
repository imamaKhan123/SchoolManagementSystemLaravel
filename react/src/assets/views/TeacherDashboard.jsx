import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function TeacherDashboard() {
    const [courses, setCourses] = useState([]);
    const { user, setNotification } = useStateContext();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosClient.get("/teacher-courses");
                setCourses(response.data.data);
            } catch (error) {
                console.error("Error fetching teacher's courses:", error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <Link className="btn-edit" to={`/show-teacher-profile/${user.id}`}>
        Show Profile
        </Link>
     <h6></h6>
        <h3>My Courses</h3>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <strong>{course.name}</strong> ({course.code})
                        <p>{course.description}</p>
                        <Link className="btn-edit" to={`/grade-assignment/${course.id}`}>
          Add Assignments
        </Link> &nbsp;
                        <Link className="btn-edit" to={`/grade-assignment/${course.id}`}>
          Grade Assignments
        </Link>
                    </li>
                ))}
            </ul>
           
        </div>
    );
}
