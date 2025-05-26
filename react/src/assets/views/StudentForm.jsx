import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.jsx";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function StudentForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [student, setStudent] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    grade: '',
    salary: '',
    designation: '',
    role: 'Student', // Default value
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  // UseEffect to fetch the student and user data when usr_id is available
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/students/${id}`)
        .then(({ data }) => {
          setLoading(false);
        console.log(data);
          // Assuming that `data` contains the student info and includes the associated user info (like name, email)
          setStudent({
            ...data,
            name: data.data.name, // Populate the user data
            id:id,
            email: data.data.email,
            password: data.data.password,
            role: data.data.role,
            salary: data.data.salary,
            grade: data.data.grade,
            designation: data.data.designation,
          });
        

        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]); // Depend on usr_id to refetch if the id changes

  const onSubmit = (ev) => {
    ev.preventDefault();
    
    if (student.id) {
      // Update student and user information if the ID is available
      axiosClient.put(`/students/${student.id}`, student)
        .then(() => {
          setNotification('Student was successfully updated');
          navigate(-1); // Go back to the previous page
        })
        .catch(err => {
          const response = err.response;
        console.log(response)
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      // Create new student and user if no ID
     
      axiosClient.post('/students', student)
        .then(() => {
          setNotification('Student was successfully created');
          navigate('/students');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {student.id ? <h1>Update Student: {student.name}</h1> : <h1>New Student{id }</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={student.name}
              onChange={ev => setStudent({ ...student, name: ev.target.value })}
              placeholder="Name"
            />
            <input
              value={student.email}
              onChange={ev => setStudent({ ...student, email: ev.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              value={student.password}
              onChange={ev => setStudent({ ...student, password: ev.target.value })}
              placeholder="Password"
            />
            <input
              type="password"
              onChange={ev => setStudent({ ...student, password_confirmation: ev.target.value })}
              placeholder="Password Confirmation"
            />
            <input
              type="text"
              value={student.grade}
              onChange={ev => setStudent({ ...student, grade: ev.target.value })}
              placeholder="Grade"
            />
             <label htmlFor="roleSelect">Fee</label>
            
            <input
              type="text"
              value={student.salary}
              onChange={ev => setStudent({ ...student, salary: ev.target.value })}
              placeholder="Salary or Fee"
            />
            <label htmlFor="roleSelect">Select Role</label>
            <select
              className="custom-select mb-3"
              value={student.role}
              onChange={(ev) => setStudent({ ...student, role: ev.target.value })}
            >
              <option value="viewer">Viewer</option>
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
            <label htmlFor="designationSelect">Select Designation</label>
            <select
              className="custom-select mb-3"
              value={student.designation}
              onChange={(ev) => setStudent({ ...student, designation: ev.target.value })}
            >
                <option value="Student">Student</option>
              <option value="Librarian">Librarian</option>
              <option value="Accountant">Accountant</option>
              <option value="Clerk">Clerk</option>
              <option value="Principal">Principal</option>
              <option value="Teacher">Teacher</option>
              
            </select>
            <button className="btn-edit">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
