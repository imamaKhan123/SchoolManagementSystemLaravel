import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../axios-client.jsx";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function ShowTeacherProfile() {
    let { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [teachingCourses, setTeachingCourses] = useState([]);
    const { user,setNotification } = useStateContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axiosClient
            .get("/teacher-courses")
            .then((response) => {
                const data = response.data.data;
                setTeacher(user);
                // setDocuments(data.documents);
                 setTeachingCourses(data); // Set teaching courses
                // const profilePic = data.profile_picture;
                // setProfilePicture(profilePic ? profilePic.file_path : null);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching teacher profile:", err);
                setError("Failed to load teacher profile.");
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
        <div className="teacher-profile">
            <h2>Teacher Profile</h2>

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

            {/* Teacher Details */}
            <div className="teacher-details">
                <h3><strong>Name: </strong>{teacher.name}</h3>
                <p><strong>Grade/Class:</strong> {teacher.grade}</p>
                <p><strong>Department:</strong> {teacher.department}</p>
                <p><strong>Salary:</strong> {teacher.salary}</p>
                <p><strong>Hiring Date:</strong> {new Date(teacher.created_at).toLocaleDateString()}</p>
            </div>

            {/* Documents Table */}
            <div className="teacher-documents">
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

            {/* Teaching Courses Table */}
            <div className="teacher-teaching-courses">
                <h3>Teaching Courses</h3>
                {teachingCourses.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Code</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachingCourses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.name}</td>
                                    <td>{course.code}</td>
                                    <td>{course.description}</td>
                                    <td>  &nbsp;
                                        <Link className="btn-edit" to={`/grade-assignment/${course.id}`}>
                                            Show Assignments
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No courses being taught.</p>
                )}
            </div>

        </div>
    );
}
