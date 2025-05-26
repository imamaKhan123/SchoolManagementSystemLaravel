import { useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function Messages() {
  const { user } = useStateContext();
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]); // For receiver users
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(false);

  // Fetch users (with search functionality)
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      axiosClient
        .get(`/users?query=${searchQuery}`) // Pass the search query as a parameter
        .then(({ data }) => {
          setUsers(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        });
    } else {
      // Default fetch for all users
      axiosClient
        .get("/users")
        .then(({ data }) => {
          setUsers(data.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [searchQuery]);

  // Fetch messages between the sender and receiver
  useEffect(() => {
    if (user.id && receiverId) {
      axiosClient
        .get(`/messages?sender_id=${user.id}&receiver_id=${receiverId}`)
        .then(({ data }) => {
          setMessages(data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [user.id, receiverId]);

  // Send a message
  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      sender_id: user.id,
      receiver_id: receiverId,
      message: message,
    };

    axiosClient
      .post("/messages", data)
      .then(({ data }) => {
        setMessages([data, ...messages]);
        setMessage("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="messages-page container">
      <h2 className="messages-title">Messages</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Receiver selection dropdown */}
      <div className="dropdown-container">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <select
            className="receiver-select"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          >
            <option value="" disabled>
              Select Receiver
            </option>
            {users.map((userItem) => (
              <option key={userItem.id} value={userItem.id}>
                {userItem.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Message List */}
      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`message ${msg.sender_id === user.id ? "sent" : "received"}`}
            >
              <p className="message-sender">
                {msg.sender_name ? msg.sender_name : "Unknown User"}:
              </p>
              <p className="message-text">{msg.message}</p>
              <p className="message-time">{new Date(msg.created_at).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>

      {/* Send Message Form */}
      <div className="send-message-form">
        <textarea
          className="message-textarea"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="send-button-container">
          <button onClick={sendMessage} className="send-button btn-edit">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
