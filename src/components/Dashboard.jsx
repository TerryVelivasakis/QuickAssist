import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../config';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const socket = io(config.API_BASE_URL, { transports: ['websocket'] });

    // Listen for new requests
    socket.on('new_request', (newRequest) => {
      setRequests((prevRequests) => [...prevRequests, newRequest]);
    });

    // Listen for request deletion
    socket.on('request_deleted', (deletedRequest) => {
      setRequests((prevRequests) => prevRequests.filter(r => r._id !== deletedRequest._id));
    });

    // Fetch existing requests
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/requests`);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();

    // Cleanup the WebSocket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Update the waiting time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prevRequests) => [...prevRequests]); // This triggers re-render
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval when component unmounts
  }, []);

  // Function to get the waiting time in minutes and seconds
  const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const requestTime = new Date(createdAt);
    const elapsedSeconds = Math.floor((now - requestTime) / 1000);

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Function to style based on the time elapsed
  const getTimeStyle = (createdAt) => {
    const now = new Date();
    const requestTime = new Date(createdAt);
    const elapsedSeconds = Math.floor((now - requestTime) / 1000);

    if (elapsedSeconds >= 300) return { color: 'red' }; // 5 minutes and above
    if (elapsedSeconds >= 180) return { color: 'yellow' }; // Between 3 and 5 minutes
    return {};
  };

  // Function to handle request clearance
  const clearRequest = async (requestId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error clearing request');
      }
    } catch (error) {
      console.error("Error clearing request:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Support Requests Dashboard</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Room</th>
            <th>Issue Description</th>
            <th>Waiting Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              <td>{request.roomId}</td>
              <td>{request.issueDescription || 'No description provided'}</td>
              <td style={getTimeStyle(request.createdAt)}>
                {getTimeElapsed(request.createdAt)}
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => clearRequest(request._id)}>
                  Clear
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
