import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Monitor.css';
import AddServerModal from '../AddServerModal/AddServerModal';
import ExportModal from '../ExportModal/ExportModal'; // Import ExportModal
import { MdOutlineDelete } from "react-icons/md";

const Monitor = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false); // New state for export modal

    const fetchServers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/servers/');
            setServers(response.data);
        } catch (err) {
            setError('Failed to fetch server data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServers();

        const intervalId = setInterval(() => {
            fetchServers();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleAddServer = async (ipAddress) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/servers/', { ip_address: ipAddress });
            const response = await axios.get('http://127.0.0.1:8000/api/servers/');
            setServers(response.data);
        } catch (err) {
            console.error('Failed to add server:', err);
        }
    };

    return (
        <div className="monitor-container">
            <div className="header">
                <h2>Server Monitor</h2>
                <div className="header-actions">
                    <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Server</button>
                    <button className="export-btn" onClick={() => setShowExportModal(true)}>Export</button>
                </div>
            </div>
            <div className="filters">
                <input type="text" placeholder="Search..." />
                <button className="filter-btn">Filter</button>
            </div>
            {loading ? (
                <p>Loading server data...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="scrollable-tbody">
                    <table className="server-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>IP Address</th>
                                <th>Status</th>
                                <th>Time Log</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {servers.map((server) => (
                                <tr key={server.ip_address}>
                                    <td>
                                        <div
                                            className="status-dot"
                                            style={{
                                                backgroundColor: server.status === 'Active' ? '#2d712c' : '#b52e25',
                                                height: '10px',
                                                width: '10px',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                marginLeft: '30px',
                                            }}
                                        ></div>
                                    </td>
                                    <td>{server.ip_address}</td>
                                    <td>{server.status}</td>
                                    <td>{server.last_ping}</td>
                                    <td><div className="delete-icon"><MdOutlineDelete /></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {showModal && (
                <AddServerModal onClose={() => setShowModal(false)} onAdd={handleAddServer} />
            )}
            {showExportModal && (
                <ExportModal onClose={() => setShowExportModal(false)} data={servers} />
            )}
        </div>
    );
};

export default Monitor;
