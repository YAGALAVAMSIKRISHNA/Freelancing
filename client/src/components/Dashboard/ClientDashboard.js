import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects/my-projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProjects(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      }
    };
    fetchProjects();
  }, []);

  if (user?.role !== 'client') {
    return <div className="alert alert-danger mt-4">Access Denied: Only clients can access this dashboard.</div>;
  }

  return (
    <div className="mt-4">
      <h2>Client Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link to="/project/new" className="btn btn-primary mb-3">Post New Project</Link>
      <h3>Your Projects</h3>
      {projects.length === 0 ? (
        <p>No projects posted yet.</p>
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
                  <Link to={`/chat/${project._id}`} className="btn btn-secondary">Chat</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;