import React, { useState, useEffect } from 'react';
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const TabSettings = () => {
  const [settings, setSettings] = useState({
    serverUrl: '',
    slackWebhook: '',
    discordWebhook: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch the settings from the API when the component loads
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/settings`);
        const data = await response.json();
        setSettings({
          serverUrl: data.serverUrl || '',
          slackWebhook: data.slackWebhook || '',
          discordWebhook: data.discordWebhook || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/settings`, {
        method: 'PUT', // Or POST depending on how you handle settings storage in the backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSuccessMessage('Settings updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Settings</h1>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="serverUrl">Server URL:</label>
          <input
            type="text"
            className="form-control"
            id="serverUrl"
            value={settings.serverUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="slackWebhook">Slack Webhook URL:</label>
          <input
            type="text"
            className="form-control"
            id="slackWebhook"
            value={settings.slackWebhook}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="discordWebhook">Discord Webhook URL:</label>
          <input
            type="text"
            className="form-control"
            id="discordWebhook"
            value={settings.discordWebhook}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default TabSettings;
