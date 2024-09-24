import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HelpForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    issue: '',
    location: ''
  });

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const roomLocation = query.get('location');
    if (roomLocation) {
      setFormData((prev) => ({ ...prev, location: roomLocation }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Logic to submit form data to the server
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Request Help</h1>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="issue" className="form-label">Issue</label>
          <textarea
            className="form-control"
            id="issue"
            name="issue"
            rows="3"
            value={formData.issue}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={formData.location}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
    </div>
  );
};

export default HelpForm;
