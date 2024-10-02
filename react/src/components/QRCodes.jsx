import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import config from '../config';  // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const QRCodes = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
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

  const downloadQR = (roomName) => {
    const svg = document.getElementById(`qr-code-${roomName}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${roomName}-qrcode.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">QR Codes</h1>
      <div className="row">
        {rooms.map((room, index) => (
          <div key={room._id} className="col-md-3 mb-4 text-center">
            <h5>{room.name}</h5>
            <QRCode
              id={`qr-code-${room.roomId}`}
              value={`${config.APP_BASE_URL}/room/${room.roomId}`}
              size={128}
            />
            <br />
            <button
              className="btn btn-primary mt-2"
              onClick={() => downloadQR(room.roomId)}
            >
              Download QR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodes;
