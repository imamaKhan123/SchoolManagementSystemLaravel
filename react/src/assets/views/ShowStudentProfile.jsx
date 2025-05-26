import React, { useState, useEffect } from 'react';
import { useParams,Link } from "react-router-dom";
import axiosClient from "../../axios-client.jsx";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function ShowStudentProfile() {
    let { id } = useParams();
    const [student, setStudent] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { user,setNotification } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient
            .get(`/student-profile/${id}`)
            .then((response) => {
                const data = response.data.data;
                console.log(response)
                setStudent(data.student);
                setDocuments(data.documents);
                setEnrolledCourses(data.enrolled_courses); // Set enrolled courses
                // console.log(enrolledCourses);
                const profilePic = data.profile_picture;
                setProfilePicture(profilePic ? profilePic.file_path : null);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching student profile:", err);
                setError("Failed to load student profile.");
                setLoading(false);
            });
           
    }, [id]);
    // useEffect(() => {
    //     axiosClient.get(`/student/${id}/progress`)
    //         .then(({ data }) => setEnrolledCourses(data.enrolled_courses))
    //         .catch(err => console.error(err));
    // }, [id]);

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
           
            {/* Profile Picture */}
            {profilePicture ? (
                <img
                    src={`http://127.0.0.1:8000/storage/${profilePicture}`}
                    alt="Profile Picture"
                    style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                />
            ) : (
                <p>No profile picture available.</p>
            )}
 <Link className="btn-edit" to={`/student/${user.id}`}>
                            Edit profile
                          </Link>
            {/* Student Details */}
            <div className="student-details">
                <h3>{student.name}</h3>
                <p><strong>Grade/Class:</strong> {student.grade}</p>
                <p><strong>Marks:</strong> {student.marks}</p>
                <p><strong>Fee:</strong> {student.salary}</p>
                <p><strong>Enrollment Date:</strong> {new Date(student.created_at).toLocaleDateString()}</p>
            </div>

            {/* Documents Table */}
            <div className="student-documents">
                <h3>Documents</h3>
                {documents.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Document Type</th>
                                <th>Link</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.type === "profile_picture" ? "Profile Picture" : doc.type}</td>
                                    <td>
                                        <a
                                            href={`http://127.0.0.1:8000/storage/${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Document
                                        </a>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => onDeleteClick(doc)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No documents available.</p>
                )}
            </div>

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
