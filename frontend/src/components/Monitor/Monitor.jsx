import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Monitor.css';

const Monitor = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        fetchServers();
    }, []);

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
                                <th>IP Address</th>  {/* Only display IP Address */}
                                <th>Uptime</th>     {/* Only display Uptime */}
                            </tr>
                        </thead>
                        <tbody>
                            {servers.map((server) => (
                                <tr key={server.ip_address}>
                                    <td>{server.ip_address}</td>  {/* Display IP Address */}
                                    <td>{server.uptime}</td>     {/* Display Uptime */}
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
