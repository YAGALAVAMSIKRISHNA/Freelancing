import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const Chat = ({ user }) => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize WebSocket connection and fetch initial messages
  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load messages');
      }
    };

    fetchMessages();

    // Connect to WebSocket
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      auth: { token: localStorage.getItem('token') },
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', projectId);
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axios.post(
        `/api/messages/${projectId}`,
        { content: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNewMessage('');
      socketRef.current.emit('sendMessage', res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  // Restrict access to clients and freelancers
  if (!user || !['client', 'freelancer'].includes(user.role)) {
    return <div className="alert alert-danger mt-4">Access Denied: Only clients and freelancers can access this chat.</div>;
  }

  return (
    <div className="card p-4 mt-4">
      <h2>Project Chat</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.sender._id === user._id ? 'bg-primary text-white text-end' : 'bg-light text-dark text-start'
            }`}
          >
            <strong>{msg.sender.name}</strong>: {msg.content}
            <small className="d-block">{new Date(msg.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            required
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;