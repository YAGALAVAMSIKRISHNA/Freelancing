import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          axios.get('/api/auth/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('/api/projects', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        ]);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleApproveUser = async (userId) => {
    try {
      await axios.patch(`/api/auth/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(users.map(u => u._id === userId ? { ...u, approved: true } : u));
      alert('User approved');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve user');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="alert alert-danger mt-4">Access Denied: Only admins can access this dashboard.</div>;
  }

  return (
    <div className="mt-4">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Manage Users</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.approved ? 'Approved' : 'Pending'}</td>
              <td>
                {!u.approved && (
                  <button className="btn btn-success" onClick={() => handleApproveUser(u._id)}>
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>All Projects</h3>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div className="row">
          {projects.map((project) => (
            <div key={project._id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text">{project.description}</p>
                  <p className="card-text"><strong>Budget:</strong> ${project.budget}</p>
                  <p className="card-text"><strong>Category:</strong> {project.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;