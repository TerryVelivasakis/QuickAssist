import React, { useState, useEffect } from 'react';
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';
import sofwerxQA from '../img/sofwerx.png';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#d3d7d6'; // Background color for the entire body
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/rooms`);
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Error fetching rooms.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      alert('Please select a room.');
      return;
    }

    const requestData = {
      roomId: selectedRoom,
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
        const errorMessage = await response.text(); 
        throw new Error(errorMessage || 'Error submitting request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setError('Error submitting request: ' + error.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (submitted) return (
    <div className="alert alert-success">Thank you! Your request has been submitted.<br/><br/> Someone will be there soon to help!</div>
  );

  return (
    <body style={{ backgroundColor: "#d3d7d6" }}>
      <div className="pt-3" style={{ backgroundColor: "#d3d7d6" }}>
        <div style={{ textAlign: 'center' }}>
          <img src={sofwerxQA} alt="SofwerxQuickAssist logo" 
            style={{ width: '90%', maxWidth:"480px",  height: 'auto', margin: '0 auto' }} />
        </div>
        <div className='mt-3 pt-1 pb-1' style={{ backgroundColor: '#28282A', fontWeight: '900', color: "#e9edf0", textAlign: 'center' }}>
          <h1 style={{ letterSpacing: "5px" }}>QuickAssist</h1>
        </div>
      </div>

      <div className="pt-1" style={{ backgroundColor: '#d3d7d6' }}>
        <div className="mt-2 container">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h3><label htmlFor="roomSelect" className="form-label bold">Select Room</label></h3>
              <select
                id="roomSelect"
                className="form-control"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
              >
                <option value="">-- Select a Room --</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room.roomId}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <h3><label htmlFor="issueDescription" className="form-label bold">How can we help?</label></h3>
              <textarea
                id="issueDescription"
                className="form-control"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows="6"
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                type="submit" 
                className="btn btn-lg" 
                style={{ backgroundColor: '#ED6622', color: '#28282A', fontWeight: 'bold' }}>
                Request the NerdHerd
              </button>
            </div>
          </form>
        </div>
      </div>
    </body>
  );
};

export default HomePage;
