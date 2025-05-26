import { useEffect, useState } from "react";
import axiosClient from "../../axios-client.jsx";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const { user, setNotification } = useStateContext();

  // Fetch users on initial render and when searchQuery or pagination.current_page changes
  useEffect(() => {
    getUsers(pagination.current_page, searchQuery);
  }, [searchQuery, pagination.current_page]);

  // Fetch users with search and pagination
  const getUsers = (page = 1, query = "") => {
    setLoading(true);
    axiosClient
    .get(`/teachers?page=${page}&query=${query}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setPagination({
          current_page: data.current_page,
          last_page: data.last_page,
          total: data.total,
        });
       
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching users:", err);
      });
  };

  // Delete user
  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient
      .delete(`/users/${user.id}`)
      .then(() => {
        setNotification("User was successfully deleted");
        getUsers(pagination.current_page, searchQuery); // Refresh users after deletion
      })
      .catch((err) => {
        console.error(err);
        setNotification("Failed to delete the user");
      });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page) return;
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Teachers</h1>
        <Link className="btn btn-primary" to="/users/new">
          Add new
        </Link>
      </div>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card animated fadeInDown">
        {loading ? (
          <div className="text-center py-3">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-3">No users found</div>
        ) : (
          <table >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Designation</th>
                <th>Grade</th>
                <th>Salary</th>
                <th>Create Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.designation === "Teacher") // Filter only Teachers
                .map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.designation}</td>
                    <td>{u.grade}</td>
                    <td>{u.salary}</td>
                    <td>{u.created_at}</td>
                    <td>
                      {user && user.role.toLowerCase() === "admin" && (
                        <>
                          <Link className="btn-edit" to={`/users/${u.id}`}>
                            Edit
                          </Link>
                          &nbsp;
                          <button
                            className="btn-delete"
                            onClick={() => onDeleteClick(u)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

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
  );
}
