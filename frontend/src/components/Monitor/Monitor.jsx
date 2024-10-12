import React from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import './Monitor.css';

const Monitor = () => {
  const servers = [
    { ip: '192.168.1.1', url: 'https://removebg.com', status: 'Up', speed: '120ms' },
    { ip: '192.168.1.2', url: 'https://canva.com', status: 'Down', speed: 'N/A' },
    { ip: '192.168.1.3', url: 'https://gridcogh.com', status: 'Up', speed: '110ms' },
    { ip: '192.168.1.4', url: 'https://gridtel.com', status: 'Up', speed: '95ms' },
    { ip: '192.168.1.5', url: 'https://infosysgh.com', status: 'Down', speed: 'N/A' },
    { ip: '192.168.1.6', url: 'https://grideatsgh.com', status: 'Up', speed: '130ms' },
    { ip: '192.168.1.7', url: 'https://firstsky.com', status: 'Up', speed: '105ms' },
    { ip: '192.168.1.8', url: 'https://telefonika.com', status: 'Down', speed: 'N/A' },
    { ip: '192.168.1.9', url: 'https://remoratel.org', status: 'Up', speed: '98ms' }
];


  return (
    <div className="monitor-container">
      <div className="header">
        <h2>Monitoring Statistics<IoMdInformationCircleOutline /></h2>
        <div className="header-actions">
          <button className="add-btn">+ Add Server</button>
          <button className="export-btn">Options</button>
        </div>
      </div>

      <div className="filters">
        <input type="text" placeholder="Quick Search" />
        <button className="filter-btn">Filters</button>
      </div>
      <table className="server-table">
        <thead>
          <tr>
            <th></th>
            <th>IP Address</th>
            <th>Server URL</th>
            <th>Status</th>
            <th>Speed</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server, index) => (
            <tr key={index}>
              <td><div className="status-dot"></div></td>
              <td>{server.ip}</td>
              <td>{server.url}</td>
              <td>{server.status}</td>
              <td>{server.speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Monitor;
