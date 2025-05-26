import {useEffect, useState} from "react";
import axiosClient from "../../axios-client.jsx";
import {Link} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()
  const [searchQuery, setSearchQuery] = useState(""); 
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const {user} = useStateContext();


 // Call getUsers on initial render and when searchQuery changes
 useEffect(() => {
  getUsers(pagination.current_page, searchQuery);
}, [searchQuery]); // Run when searchQuery changes


  const onDeleteClick = user => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
   
    axiosClient.delete(`/users/${user.id}`)
    .then(() => {
      setNotification('User was successfully deleted');
      getUsers(); // Refresh the list of users
    })
    .catch((err) => {
      console.error(err);
      setNotification('Failed to delete the user');
    });
  }

   // Fetch users with search query
   const getUsers = (page = 1, query = '') => {
    setLoading(true);
    axiosClient
      .get(`/users?page=${page}&query=${query}`)
      .then(({ data }) => {
       // console.log(data.data);
        setLoading(false);
        setUsers(data.data);
        setPagination({
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          total: data.meta.total,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching users:", err);
      });
  };




 // Pagination logic
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return; // Prevent invalid pages
    getUsers(page);
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Users</h1>
        <Link className="btn-add" to="/users/new">Add new</Link>
      </div>
  {/* Search bar */}
  <div>
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      <div className="card animated fadeInDown">
        <table style={{ marginBottom: '2%'}}>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Designation</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.designation}</td>
                <td>{u.created_at}</td>
                <td>
                {u && user.role.toLowerCase() === 'admin' && (
                  <>
                  <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
               </>
               )}
              
                  </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
 {/* Pagination Links */}
 <div className="pagination">
          <button 
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            Previous
          </button>
          &nbsp;
          <span>
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          &nbsp;

          <button
            className = ''
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            Next
          </button>
        </div>
     

      </div>
    </div>
  )
}