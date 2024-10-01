import React, { useState, useEffect } from 'react';
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';
import sofwerxQA from '../img/sofwerxQA.png';

const HelpForm = () => {
  const [room, setRoom] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
       document.body.style.backgroundColor = '#7c7d80';
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
  if (submitted) return <div className="alert alert-success">Thank you! Your request has been submitted.<br/><br/> Someone will be there soon to help!</div>;

  return (
    <body  style={{background: "#7c7d80"}}>
    <div className="container mt-5">
      <div style={{ textAlign: 'center' }}>
        <img src={sofwerxQA} alt="SofwerxQuickAssist logo"         style={{ 
          width: '90%', 
          maxWidth: '100%', 
          height: 'auto', 
          display: 'block', 
          margin: '0 auto' 
        }} />
      </div>
      <h1 className="mb-3" style={{ textAlign: 'center' }}>{room.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="issueDescription" className="form-label bold">How can we help?</label>
          <textarea
            id="issueDescription"
            className="form-control"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            rows="6"
          />
        </div>
        <div style={{textAlign: 'center'}}>
        <button 
  type="submit" 
  className="btn btn-lg" 
  style={{ backgroundColor: '#ED6622', color: '#28282A', fontWeight: 'bold'}}>
  Call the NerdHerd
</button>
</div>
      </form>
      <div className="mt-3" style={{ visibility: 'hidden'}}>
        <a href={room.wikiLink} className="btn btn-link" target="_blank" rel="noopener noreferrer">
          Visit {room.name}'s Wiki for self-help
        </a>
      </div>
    </div>
    </body>
  );
};

export default HelpForm;
