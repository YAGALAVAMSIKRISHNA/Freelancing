import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', { title, description, budget, category }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Project posted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post project');
    }
  };

  if (user?.role !== 'client') return <div>Access Denied</div>;

  return (
    <div className="card p-4 mt-4">
      <h2>Post a Project</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Budget ($)</label>
          <input type="number" className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Writing">Writing</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Post Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;