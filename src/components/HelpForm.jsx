import React, { useState, useEffect } from 'react';
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const HelpForm = () => {
  const [room, setRoom] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomId = window.location.pathname.split("/")[2]; // Assuming room ID is in the URL
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room data');
        }
        const data = await response.json();
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError('Error fetching room data.');
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const roomId = window.location.pathname.split("/")[2];
    const requestData = {
      roomId,
      issueDescription: issueDescription.trim() || 'Help requested', // Provide default if empty
    };
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorMessage = await response.text(); // Get more detailed error message if available
        throw new Error(errorMessage || 'Error submitting request');
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setError('Error submitting request: ' + error.message);
    }
  };
  

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (submitted) return <div className="alert alert-success">Thank you! Your request has been submitted.</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Get help in {room.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="issueDescription" className="form-label">How can we help?</label>
          <textarea
            id="issueDescription"
            className="form-control"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows="4"
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      <div className="mt-3">
        <a href={room.wikiLink} className="btn btn-link" target="_blank" rel="noopener noreferrer">
          Visit {room.name}'s Wiki for self-help
        </a>
      </div>
    </div>
  );
};

export default HelpForm;
