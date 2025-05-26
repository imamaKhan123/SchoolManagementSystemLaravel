import React, { useState, useEffect } from 'react';
import { useParams,Link } from "react-router-dom";
import axiosClient from "../../axios-client.jsx";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function ShowCourses() {
    let { id } = useParams();

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { setNotification } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient
            .get(`/student-profile/${id}`)
            .then((response) => {
                const data = response.data.data;
                // console.log(response)
              
                setEnrolledCourses(data.enrolled_courses); // Set enrolled courses
                // console.log(enrolledCourses);
               
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses.");
                setLoading(false);
            });
           
    }, [id]);

    const onDeleteClick = (doc) => {
        if (!window.confirm("Are you sure you want to delete this document?")) {
            return;
        }

        axiosClient
            .delete(`/documents/${doc.id}`)
            .then((res) => {
                setNotification("Document was successfully deleted");
                setDocuments((prevDocuments) =>
                    prevDocuments.filter((d) => d.id !== doc.id)
                );
            })
            .catch((err) => {
                console.error(err);
                setNotification("Failed to delete the document");
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="student-profile">
            <h2>Student Profile</h2>

           

            
            {/* Enrolled Courses Table */}
            <div className="student-enrolled-courses">
                <h3>Enrolled Courses</h3>
                {enrolledCourses.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Code</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolledCourses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.name}</td>
                                    <td>{course.code}</td>
                                    <td>{course.description}</td>
                                    <td>  &nbsp;
                          <Link className="btn-edit" to={`/assignment/${course.id}`}>
                           Show Assignments
                          </Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No courses enrolled.</p>
                )}
            </div>

            <div>
            <h3>Course Progress</h3>
            {enrolledCourses.map((course) => (
                <div key={course.id} style={{ marginBottom: '15px' }}>
                    <p><strong>Course Name:</strong> {course.course_name}</p>
                    <p><strong>Grade:</strong> {course.grade || 'N/A'}</p>
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${course.progress}%` }}
                            aria-valuenow={course.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {course.progress}%
                        </div>
                    </div>
                </div>
            ))}
        </div>


        </div>
    );
}
