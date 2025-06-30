import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import FreelancerDashboard from './components/Dashboard/FreelancerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ProjectForm from './components/Project/ProjectForm';
import BidForm from './components/Project/BidForm';
import Chat from './components/Chat/Chat';
import UserProfile from './components/Profile/UserProfile';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">SB Works</a>
          <div className="navbar-nav">
            {user ? (
              <>
                <a className="nav-link" href="/profile">Profile</a>
                <a className="nav-link" href="/logout" onClick={() => { localStorage.removeItem('token'); setUser(null); }}>Logout</a>
              </>
            ) : (
              <>
                <a className="nav-link" href="/login">Login</a>
                <a className="nav-link" href="/register">Register</a>
              </>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
          <Route path="/" element={user ? (
            user.role === 'client' ? <ClientDashboard user={user} /> :
            user.role === 'freelancer' ? <FreelancerDashboard user={user} /> :
            <AdminDashboard user={user} />
          ) : <Navigate to="/login" />} />
          <Route path="/project/new" element={<ProjectForm user={user} />} />
          <Route path="/project/:id/bid" element={<BidForm user={user} />} />
          <Route path="/chat/:projectId" element={<Chat user={user} />} />
          <Route path="/profile/:userId" element={<UserProfile user={user} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;