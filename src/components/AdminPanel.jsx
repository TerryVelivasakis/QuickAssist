import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [wikiLink, setWikiLink] = useState('');
  const [editRoomId, setEditRoomId] = useState(null);
  const [qrRoom, setQrRoom] = useState(null); // State for the room to generate QR code

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/rooms`);
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const roomData = { name: roomName, wikiLink };
    const method = editRoomId ? 'PUT' : 'POST';
    const endpoint = editRoomId 
      ? `${config.API_BASE_URL}/api/rooms/${editRoomId}` 
      : `${config.API_BASE_URL}/api/rooms`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (response.ok) {
        const updatedRooms = await response.json();
        setRooms(updatedRooms);
        setRoomName('');
        setWikiLink('');
        setEditRoomId(null);
      }
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  const handleEdit = (room) => {
    setRoomName(room.name);
    setWikiLink(room.wikiLink);
    setEditRoomId(room._id);
  };

  const handleDelete = async (roomId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRooms(rooms.filter(room => room._id !== roomId));
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Handle Generate QR Code Button Click
  const handleGenerateQR = (roomName) => {
    var qrData = `${config.APP_BASE_URL}/room/${roomName}`;
    console.log("roomName", qrData);
    setQrRoom(qrData); // Set the room name for QR code generation
  };

  // Handle close QR code
  const handleCloseQR = () => {
    setQrRoom(null); // Close the QR code
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Panel - Manage Rooms</h1>
      
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="roomName">Room Name:</label>
          <input
            type="text"
            className="form-control"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="wikiLink">Wiki Link:</label>
          <input
            type="text"
            className="form-control"
            id="wikiLink"
            value={wikiLink}
            onChange={(e) => setWikiLink(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editRoomId ? 'Update Room' : 'Add Room'}
        </button>
      </form>

      {qrRoom && (
        <div className="mt-4 text-center">
          <h3>QR Code for Room Help Page</h3>
          <QRCode
            value={`${qrRoom}`} // Generate QR for room help page
            size={200}
          />
          <div className="mt-2">
            <button className="btn btn-danger" onClick={handleCloseQR}>
              Close QR Code
            </button>
          </div>
        </div>
      )}

      <h2>Existing Rooms</h2>
      <ul className="list-group">
        {rooms.map(room => (
          <li key={room._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {room.name} - <a href={room.wikiLink} target="_blank" rel="noopener noreferrer">Wiki</a>
            </span>
            <span>
              <button onClick={() => handleGenerateQR(room.roomId)} className="btn btn-primary btn-sm">QR Code</button>
              <button onClick={() => handleEdit(room)} className="btn btn-warning btn-sm me-2">Edit</button>
              <button onClick={() => handleDelete(room._id)} className="btn btn-danger btn-sm">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
