import React, { useState, useEffect } from 'react';
import TabRooms from './TabRooms'; // Component for Rooms
import TabPeople from './TabPeople'; // Component for People
import TabSettings from './TabSettings'; // Component for Settings
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rooms');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'rooms':
        return <TabRooms />;
      case 'people':
        return <TabPeople />;
      case 'settings':
        return <TabSettings />;
      default:
        return <Rooms />;
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Admin Panel</h1>
      
      {/* Tab navigation */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`} 
            onClick={() => setActiveTab('rooms')}
          >
            Rooms
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'people' ? 'active' : ''}`} 
            onClick={() => setActiveTab('people')}
          >
            People
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </li>
      </ul>

      {/* Content based on active tab */}
      <div className="tab-content mt-3">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
