import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BidForm = ({ user }) => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/bids/${projectId}`,
        { amount, timeline, portfolioLink, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Bid submitted successfully');
      navigate('/'); // Redirect to Freelancer Dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit bid');
    }
  };

  // Restrict access to freelancers only
  if (user?.role !== 'freelancer') {
    return <div className="alert alert-danger mt-4">Access Denied: Only freelancers can submit bids.</div>;
  }

  return (
    <div className="card p-4 mt-4">
      <h2>Submit a Bid</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Bid Amount ($)</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Timeline (days)</label>
          <input
            type="number"
            className="form-control"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Portfolio Link (Optional)</label>
          <input
            type="url"
            className="form-control"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            placeholder="e.g., https://yourportfolio.com"
          />
        </div>
        <div className="mb-3">
          <label>Message to Client</label>
          <textarea
            className="form-control"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Bid</button>
      </form>
    </div>
  );
};

export default BidForm;