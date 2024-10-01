import React, { useState, useEffect, useRef } from 'react';
import { QRCode } from 'qrcode.react'; // Import the QR code library
import config from '../config'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const QRCodePage = () => {
  const [rooms, setRooms] = useState([]);
  const qrCodeRefs = useRef({}); // Use ref to store references to QRCode canvases

  useEffect(() => {
    // Fetch rooms from the backend
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/rooms`);
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  // Function to generate QR code data for a room
  const handleGenerateQR = (roomName) => {
    return `${config.APP_BASE_URL}/room/${roomName}`;  // Same QR data logic as in the admin page
  };

  // Function to download QR code as a transparent PNG
  const downloadQRCode = (roomName) => {
    const canvas = qrCodeRefs.current[roomName];
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream'); // Convert to PNG data URL

    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${roomName}.png`; // Set the name for the downloaded file
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); // Clean up
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">QR Codes for All Rooms (PNG Export)</h1>
      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-4 text-center" key={room._id}>
            <h5>{room.name}</h5>
            <QRCode
              value={handleGenerateQR(room.name)}
              size={150}
              bgColor="transparent"  // Make the background transparent
              level="H"  // High error correction for better scanning after download
              ref={(el) => (qrCodeRefs.current[room.name] = el)}  // Reference the canvas
            />
            <br />
            <button className="btn btn-primary mt-2" onClick={() => downloadQRCode(room.name)}>
              Download PNG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodePage;
