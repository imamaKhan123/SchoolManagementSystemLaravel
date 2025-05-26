import React, { useState, useEffect } from 'react';
import axiosClient from "../../axios-client.jsx";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function CourseAssignments({ courseId }) {
    const [assignments, setAssignments] = useState([]);
    const { setNotification } = useStateContext();
    const [submissions, setSubmissions] = useState({});
    const [grades, setGrades] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    let { id } = useParams();

    useEffect(() => {
        axiosClient.get(`/course/${id}/assignments`)
            .then(({ data }) => {
                // console.log(data)
                setAssignments(data.assignments);
                const submissionMap = {};
                const gradeMap = {};
                data.assignments.forEach((assignment) => {
                    submissionMap[assignment.id] = assignment.submission || null;
                    if (assignment.submission) {
                        gradeMap[assignment.id] = {
                            grade: assignment.submission.grade,
                            feedback: assignment.submission.feedback,
                        };
                    }
                });
                setSubmissions(submissionMap);
                setGrades(gradeMap);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (assignmentId) => {
        if (!selectedFile) {
            alert("Please select a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("assignment_id", assignmentId);

        axiosClient.post(`/assignments/${assignmentId}/submit`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(({ data }) => {
                setNotification(data.message);
                setSelectedFile(null);
                setSubmissions((prev) => ({
                    ...prev,
                    [assignmentId]: data.submission,
                }));
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (assignmentId) => {
        axiosClient.delete(`/assignments/${assignmentId}/submission`)
            .then(({ data }) => {
                setNotification(data.message + ' Submit Again.');
                setSubmissions((prev) => ({
                    ...prev,
                    [assignmentId]: null,
                }));
            })
            .catch(err => console.error(err));
    };

    return (
        <div>
            <h3>Assignments</h3>
            {/* Conditionally render when there are no assignments */}
            {assignments.length === 0 ? (
                <p>No assignments yet</p>
            ) : (
                assignments.map((assignment) => (
                    <div key={assignment.id} style={{ marginBottom: "20px" }}>
                        <p><strong>Title:</strong> {assignment.title}</p>
                        <p><strong>Description:</strong> {assignment.description}</p>
                        <p><strong>Due Date:</strong> {assignment.due_date}</p>
                        <a href={`http://127.0.0.1:8000/storage/${assignment.file_path}`} target="_blank" rel="noreferrer">Download Assignment</a>

                        <div>
                            {submissions[assignment.id] ? (
                                <div>
                                    <p style={{ color: "blue" }}>
                                        <strong>Submitted File:</strong>{" "}
                                        <a href={`http://127.0.0.1:8000/storage/${submissions[assignment.id].file_path}`} target="_blank" rel="noreferrer">
                                            {submissions[assignment.id].file_path}
                                        </a>
                                    </p>
                                    <button className='btn-delete' onClick={() => handleDelete(assignment.id)}>Resubmit</button>

                                    {/* Show Grade */}
                                    {grades[assignment.id] ? (
                                        <div className="show-grade">
                                            <p><strong>Grade:</strong> {grades[assignment.id].grade}</p>
                                            <p><strong>Feedback:</strong> {grades[assignment.id].feedback}</p>
                                        </div>
                                    ) : (
                                        <div className="show-grade">
                                            <p><strong>Not Graded Yet</strong></p>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div>
                                    <label htmlFor={`file-upload-${assignment.id}`}>Submit File:</label>
                                    <input
                                        type="file"
                                        id={`file-upload-${assignment.id}`}
                                        onChange={handleFileChange}
                                    />
                                    <button className='btn-edit' onClick={() => handleSubmit(assignment.id)}>Submit</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
