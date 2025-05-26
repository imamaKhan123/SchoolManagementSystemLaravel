import React, { useState, useEffect } from 'react';
import axiosClient from '../../axios-client'; 
import { useParams } from "react-router-dom";

const EnrollStudent = () => {
    const { id } = useParams(); // Assuming studentId is passed as a URL parameter
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [notification, setNotification] = useState("");
    const [error, setError] = useState("");

    // Fetch courses when the component mounts
    useEffect(() => {
        axiosClient
            .get("/courses") // Fetch courses from your backend
            .then((response) => {
              //  console.log("", response.data.data);

                setCourses(response.data.data); // Assuming the API response has a "data" key with the courses array
            })
            .catch((err) => {
                setError("Error fetching courses.");
                console.error(err);
            });
    }, []);

    const handleEnroll = () => {
        if (!selectedCourse) {
            setNotification("Please select a course to enroll.");
            return;
        }

        axiosClient
            .post(`/students/${id}/enroll`, { course_id: selectedCourse}) // Adjust endpoint as per your backend logic
            .then((response) => {
                setNotification("Student successfully enrolled!");
                setSelectedCourse(""); // Clear the selection
            })
            .catch((err) => {
         
                setError("Failed to enroll student." + err.response.data.message);

                console.error(err);
            });
    };

    return (
        <div>
            <h2>Enroll Student {id}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {notification && <p style={{ color: "green" }}>{notification}</p>}
            <select
                value={selectedCourse}
                className='receiver-select'
                onChange={(e) => setSelectedCourse(e.target.value)}
            >
                <option value="">Select a course</option>
                {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                ))}
            </select>
            <button className="btn-edit" onClick={handleEnroll} style={{ marginLeft: "10px" }}>
                Enroll
            </button>
        </div>
    );
};

export default EnrollStudent;

