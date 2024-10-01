import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';  // You can use the `react-qr-code` library
import config from '../config';  // Adjust the config path based on your structure
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
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">QR Codes for All Rooms</h1>
      <div className="table-responsive">
        <table className="table">
          <tbody>
            {rooms.reduce((rows, room, index) => {
              // Every 4 items, create a new row
              if (index % 4 === 0) {
                rows.push([]);
              }
              rows[rows.length - 1].push(room);
              return rows;
            }, []).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((room) => (
                  <td key={room._id} className="text-center">
                    <h5>{room.name}</h5>
                    <QRCode
                      value={`${config.APP_BASE_URL}/room/${room.name}`}
                      size={150}
                      bgColor="transparent"
                      fgColor="#000000"
                    />
                  </td>
                ))}
                {row.length < 4 && [...Array(4 - row.length)].map((_, i) => (
                  <td key={`empty-${i}`} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QRCodes;
