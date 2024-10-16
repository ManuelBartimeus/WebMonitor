import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Monitor.css';

const Monitor = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/servers/');
            setServers(response.data);
        } catch (err) {
            setError('Failed to fetch servers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServers(); // Initial fetch

        // Set an interval to fetch server data every 5 seconds
        const intervalId = setInterval(() => {
            fetchServers();
        }, 5000);

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means it runs once on mount

    return (
        <div className="monitor-container">
            <div className="header">
                <h2>Server Monitor</h2>
                <div className="header-actions">
                    <button className="add-btn">Add Server</button>
                    <button className="export-btn">Export</button>
                </div>
            </div>
            <div className="filters">
                <input type="text" placeholder="Search..." />
                <button className="filter-btn">Filter</button>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="scrollable-tbody">
                    <table className="server-table">
                        <thead>
                            <tr>
                                <th></th>  {/* Empty Header */}
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servers.map((server) => (
                                <tr key={server.ip_address}>
                                    <td>
                                        <div
                                            className="status-dot"
                                            style={{
                                                backgroundColor: server.status === 'Active' ? 'green' : 'red',
                                                height: '10px',
                                                width: '10px',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                            }}
                                        ></div>
                                    </td>
                                    <td>{server.ip_address}</td>
                                    <td>{server.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Monitor;
