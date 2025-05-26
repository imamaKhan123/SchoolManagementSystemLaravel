import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.jsx";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: ''  ,
    grade: ''  ,
    salary: ''  ,
    designation: '' 
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  // UseEffect to fetch the user data when id is available
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);  // Set the fetched user data
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]); // depend on id to refetch if the id changes

  const onSubmit = ev => {
    ev.preventDefault()
    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification('User was successfully updated')
          // navigate('/users')
          navigate(-1);

        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/users', user)
        .then(() => {
          setNotification('User was successfully created')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>New User</h1>}
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
            <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Name"/>
            <input value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email"/>
            <input type="password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Password"/>
            <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
            <input type="text" onChange={ev => setUser({...user, grade: ev.target.value})} placeholder="Grade"/>
            <input type="text" onChange={ev => setUser({...user, salary: ev.target.value})} placeholder="Salary or Fee"/>
            
              {/* Role dropdown (only visible for admins) */}
              <label htmlFor="roleSelect">Select Role</label> {/* Label for the select tag */}
   
              <select
  className="custom-select mb-3" // Bootstrap and custom classes
  value={user.role}
  onChange={(ev) => setUser({ ...user, role: ev.target.value })}
  // disabled={!user.id} // Uncomment to disable for new users
>
  <option value="viewer">Viewer</option>
  <option value="user">User</option>
  <option value="editor">Editor</option>
  <option value="admin">Admin</option>
</select>
<label htmlFor="roleSelect">Select Designation</label> {/* Label for the select tag */}
   
<select
  className="custom-select mb-3" // Bootstrap and custom classes
  value={user.designation}
  onChange={(ev) => setUser({ ...user, designation: ev.target.value })}
  // disabled={!user.id} // Uncomment to disable for new users
> 
  <option value="Librarian">Librarian</option>
  <option value="Accountant">Accountant</option>
  <option value="Clerk">Clerk</option>
  <option value="Principal">Principal</option>
  <option value="Teacher">Teacher</option>
  <option value="Student">Student</option>
</select>
          
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}