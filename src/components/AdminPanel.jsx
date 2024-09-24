import React, { useState, useEffect } from 'react';
import config from '../config'; // Adjust the path

const AdminPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [wikiLink, setWikiLink] = useState('');
  const [editRoomId, setEditRoomId] = useState(null);

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

      <h2>Existing Rooms</h2>
      <ul className="list-group">
        {rooms.map(room => (
          <li key={room._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {room.name} - <a href={room.wikiLink} target="_blank" rel="noopener noreferrer">Wiki</a>
            </span>
            <span>
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
