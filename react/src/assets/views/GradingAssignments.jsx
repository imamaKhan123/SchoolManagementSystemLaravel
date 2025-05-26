// GradingAssignments.js
import React, { useState, useEffect } from 'react';
import axiosClient from "../../axios-client.jsx";
import { useParams } from 'react-router-dom';
import { useStateContext } from "../../contexts/ContextProvider.jsx";

function GradingAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { courseId } = useParams(); 
  const { setNotification } = useStateContext();

  // Fetch assignments when the component mounts
  useEffect(() => {
    axiosClient.get(`/course/${courseId}/assignments`)
      .then(({ data }) =>
        { setAssignments(data.assignments)
            
        }
        )
      
      .catch(err => console.error(err));
  }, [courseId]);

  // Fetch submissions for a selected assignment
  const handleAssignmentSelect = (assignmentId) => {
    axiosClient.get(`/assignments/${assignmentId}/submissions`)
      .then(({ data }) => {
        // console.log(data)
        setSubmissions(data.submissions);
        setSelectedAssignment(assignmentId);
      })
      .catch(err => console.error(err));
  };

  // Handle grading
  const handleGradeSubmission = () => {
    const submissionId = selectedSubmission.id;

    const data = {
      grade,
      feedback
    };

    axiosClient.post(`/assignments/${selectedAssignment}/grade`, { submission_id: submissionId, ...data })
      .then(response => {
        setNotification('Grade updated successfully!');
        setSubmissions(submissions.map(submission => 
          submission.id === submissionId ? { ...submission, grade } : submission
        ));
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Grading Assignments for Course {courseId}</h1>

      <div>
        <h2>Select an Assignment</h2>
        <ul>
          {assignments.map(assignment => (
          <li
          key={assignment.id}
          className="assignment-item"
          onClick={() => handleAssignmentSelect(assignment.id)}
        >
          {assignment.title}
        </li>
        
          ))}
        </ul>
      </div>

      {selectedAssignment && (
        <div>
          <h2>Submissions for Assignment {selectedAssignment}</h2>
          <ul>
            {submissions.map(submission => (
              <li className="assignment-item" key={submission.id} onClick={() => setSelectedSubmission(submission)}>
                <strong>Student Id: {submission.user_id}</strong> - {submission.status}
                <p>{submission.file_path}</p> <p>Submitted at: {submission.created_at}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedSubmission && (
        <div>
          <h3>Grade Submission</h3>
        <div className="grade-input-container">
  <label>
    Grade:
    <input 
      type="number" 
      value={grade} 
      onChange={(e) => setGrade(e.target.value)} 
      min="0" 
      max="100" 
    />
  </label>
</div>

<div className="feedback-container">
  <label>
    Feedback:
    <textarea 
      value={feedback} 
      onChange={(e) => setFeedback(e.target.value)} 
      placeholder="Write feedback here..." 
    />
  </label>
</div>

          <button className='btn-edit' onClick={handleGradeSubmission}>Submit Grade</button>
        </div>
      )}
    </div>
  );
}

export default GradingAssignments;
