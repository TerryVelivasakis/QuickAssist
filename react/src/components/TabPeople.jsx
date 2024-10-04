import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const TabPeople = () => {
  const [people, setPeople] = useState([]);
  const [personName, setPersonName] = useState('');
  const [editPersonId, setEditPersonId] = useState(null);
  const [qrPerson, setQrPerson] = useState(null); // State for the person to generate QR code

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/people`);
        const data = await response.json();
        setPeople(data);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const personData = { name: personName };
    const method = editPersonId ? 'PUT' : 'POST';
    const endpoint = editPersonId 
      ? `${config.API_BASE_URL}/api/people/${editPersonId}` 
      : `${config.API_BASE_URL}/api/people`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      });

      if (response.ok) {
        const updatedPeople = await response.json();
        setPeople(updatedPeople);
        setPersonName('');
        setEditPersonId(null);
      }
    } catch (error) {
      console.error("Error saving person:", error);
    }
  };

  const handleEdit = (person) => {
    setPersonName(person.name);
    setEditPersonId(person._id);
  };

  const handleDelete = async (personId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/people/${personId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPeople(people.filter(person => person._id !== personId));
      }
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  // Handle Generate QR Code Button Click
  const handleGenerateQR = (personName) => {
    var qrData = `${config.APP_BASE_URL}/person/${personName}`;
    console.log("personName", qrData);
    setQrPerson(qrData); // Set the person name for QR code generation
  };

  // Handle close QR code
  const handleCloseQR = () => {
    setQrPerson(null); // Close the QR code
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Panel - Manage People</h1>
      
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="personName">Person's Name:</label>
          <input
            type="text"
            className="form-control"
            id="personName"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editPersonId ? 'Update Person' : 'Add Person'}
        </button>
      </form>

      {qrPerson && (
        <div className="mt-4 text-center">
          <h3>QR Code for Person Help Page</h3>
          <QRCode
            value={`${qrPerson}`} // Generate QR for person help page
            size={200}
          />
          <div className="mt-2">
            <button className="btn btn-danger" onClick={handleCloseQR}>
              Close QR Code
            </button>
          </div>
        </div>
      )}

      <h2>Existing People</h2>
      <ul className="list-group">
        {people.map(person => (
          <li key={person._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {person.name}
            </span>
            <span>
              <button onClick={() => handleGenerateQR(person.name)} className="btn btn-primary btn-sm">QR Code</button>
              <button onClick={() => handleEdit(person)} className="btn btn-warning btn-sm me-2">Edit</button>
              <button onClick={() => handleDelete(person._id)} className="btn btn-danger btn-sm">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabPeople;
