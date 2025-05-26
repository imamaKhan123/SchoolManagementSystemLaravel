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


  const onAddClick = async (user) => {
    if (!window.confirm("Are you sure you want to add this user?")) {
        return
      }
    try {
         // Send the user ID to the backend API
         const response = await axiosClient.post(`/students/${user.id}`, { id: user.id });
      // Show a success message   alert(response.data.message); 
        setNotification('student was successfully added');
        window.location.reload();

    } catch (error) {
        console.error('Error adding student:', error.response?.data || error.message);
        setNotification('Failed to add the student');
       
    }
};
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
        <h1>Existing Users</h1>
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
                  u.designation !== 'Student' && (
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
                  {/* <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                  &nbsp; */}
                  <button className="btn-edit" onClick={ev => onAddClick(u)}>Add to Students Table</button>
               </>
               )}
              
                  </td>
              </tr>)
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