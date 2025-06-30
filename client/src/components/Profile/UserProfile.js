import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = ({ user }) => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState('');
  const [portfolio, setPortfolio] = useState({ title: '', description: '', link: '' });
  const [review, setReview] = useState({ rating: '', comment: '' });
  const [error, setError] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(res.data);
        setSkills(res.data.skills?.join(', ') || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, [userId]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        portfolio: profile.portfolio.concat(portfolio.title && portfolio.description && portfolio.link ? [portfolio] : []),
      };
      const res = await axios.put(`/api/auth/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(res.data);
      setIsEditing(false);
      setPortfolio({ title: '', description: '', link: '' });
      alert('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/users/${userId}/reviews`, review, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile({
        ...profile,
        reviews: [...profile.reviews, { ...review, reviewer: user }],
      });
      setReview({ rating: '', comment: '' });
      alert('Review submitted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  // Restrict editing to the profile owner
  const canEdit = user?._id === userId;

  if (!profile) {
    return <div className="mt-4">Loading...</div>;
  }

  return (
    <div className="card p-4 mt-4">
      <h2>{profile.name}'s Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <h4>Details</h4>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        {profile.skills?.length > 0 && (
          <p><strong>Skills:</strong> {profile.skills.join(', ')}</p>
        )}
      </div>

      {canEdit && (
        <div className="mb-3">
          <button
            className="btn btn-primary mb-3"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
          {isEditing && (
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., HTML, CSS, JavaScript"
                />
              </div>
              <h5>Add Portfolio Item</h5>
              <div className="mb-3">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={portfolio.title}
                  onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={portfolio.description}
                  onChange={(e) => setPortfolio({ ...portfolio, description: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label>Link</label>
                <input
                  type="url"
                  className="form-control"
                  value={portfolio.link}
                  onChange={(e) => setPortfolio({ ...portfolio, link: e.target.value })}
                  placeholder="e.g., https://yourportfolio.com"
                />
              </div>
              <button type="submit" className="btn btn-success">Save Changes</button>
            </form>
          )}
        </div>
      )}

      <div className="mb-3">
        <h4>Portfolio</h4>
        {profile.portfolio?.length > 0 ? (
          <ul className="list-group">
            {profile.portfolio.map((item, index) => (
              <li key={index} className="list-group-item">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">View Project</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No portfolio items yet.</p>
        )}
      </div>

      <div className="mb-3">
        <h4>Reviews</h4>
        {profile.reviews?.length > 0 ? (
          <ul className="list-group">
            {profile.reviews.map((rev, index) => (
              <li key={index} className="list-group-item">
                <p><strong>Rating:</strong> {rev.rating}/5</p>
                <p>{rev.comment}</p>
                <p><small>By {rev.reviewer.name}</small></p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {user && user._id !== userId && (
        <div className="mb-3">
          <h4>Leave a Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label>Rating (1-5)</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max="5"
                value={review.rating}
                onChange={(e) => setReview({ ...review, rating: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label>Comment</label>
              <textarea
                className="form-control"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;