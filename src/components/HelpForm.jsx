import React, { useState, useEffect } from 'react';
import config from '../config'; // Adjust the path based on your folder structure

const HelpForm = () => {
  const [room, setRoom] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomId = window.location.pathname.split("/")[2]; // Assuming room ID is in the URL
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/rooms/${roomId}`);
        const data = await response.json();
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (issueDescription.trim()) {
      const roomId = window.location.pathname.split("/")[2];
      const requestData = { roomId, issueDescription };

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
        }
      } catch (error) {
        console.error("Error submitting request:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (submitted) return <div>Thank you! Your request has been submitted.</div>;

  return (
    <div className="help-form">
      <h1>Get help in {room.name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="issueDescription">How can we help?</label>
          <textarea
            id="issueDescription"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      <a href={room.wikiLink} target="_blank" rel="noopener noreferrer">
        Visit {room.name}'s Wiki for self-help
      </a>
    </div>
  );
};

export default HelpForm;
