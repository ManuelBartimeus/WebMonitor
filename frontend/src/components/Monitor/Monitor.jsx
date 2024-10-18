import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Monitor.css';
import AddServerModal from '../AddServerModal/AddServerModal';
import ExportModal from '../ExportModal/ExportModal'; // Import ExportModal
import Search from '../Search/Search'; // Import Search component
import { MdOutlineDelete } from "react-icons/md";


const Monitor = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false); // New state for export modal
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    const fetchServers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/servers/');
            setServers(response.data);
            setError(null); // Clear error on successful fetch
        } catch (err) {
            setError('Reconnecting to database...');
            console.error(err);
            
            setTimeout(() => {
                fetchServers();
            }, 500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
        script.type = "module";
        document.body.appendChild(script);

        fetchServers();

        const intervalId = setInterval(() => {
            fetchServers();
        }, 5000);

        return () => {
            clearInterval(intervalId);
            document.body.removeChild(script); // Clean up the script
        };
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

    const handleDeleteServer = async (ipAddress) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/servers/${ipAddress}/`);
            // Remove the deleted server from the state
            setServers((prevServers) => prevServers.filter(server => server.ip_address !== ipAddress));
        } catch (err) {
            console.error('Failed to delete server:', err);
        }
    };    

    const filteredServers = servers.filter(server => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            server.ip_address.toLowerCase().includes(lowerCaseSearchTerm) ||
            server.status.toLowerCase().includes(lowerCaseSearchTerm) ||
            server.last_ping.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'Critical':
                return { border: '2px solid #900C3F', color: '#900C3F' }; 
            case 'High Priority':
                return { border: '2px solid #ca0c0c', color: '#ca0c0c' }; 
            case 'Important':
                return { border: '2px solid #044b9e', color: '#044b9e' };
            case 'Standard':
                return { border: '2px solid #04779e', color: '#04779e' }; 
            case 'Low Priority':
                return { border: '2px solid #9e5404', color: '#9e5404' }; 
            case 'Decommissioned':
                return { border: '2px solid #9e8004', color: '#9e8004' };
            default:
                return { border: '2px solid #e0e0e0', color: '#e0e0e0' }; 
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
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
                <button className="filter-btn">Filter</button>
            </div>
            {loading ? (
                <div className="loading-container">
                    <dotlottie-player 
                        src="https://lottie.host/c7bc1931-f10a-42df-a962-6f47e6238daf/Mf2qmJCbvV.json" 
                        background="transparent" 
                        speed="1" 
                        style={{ width: '400px', height: '400px' }} // Increased size
                        loop 
                        autoplay>
                    </dotlottie-player>
                </div>
            ) : error ? (
                <div className="error-message-container">
                    <dotlottie-player 
                        src="https://lottie.host/c7bc1931-f10a-42df-a962-6f47e6238daf/Mf2qmJCbvV.json" 
                        background="transparent" 
                        speed="1" 
                        style={{ width: '350px', height: '350px' }}
                        loop 
                        autoplay>
                    </dotlottie-player>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="scrollable-tbody">
                    <table className="server-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>IP Address</th>
                                <th>Server Name</th> 
                                <th>Access Group</th> 
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Time Log</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServers.map((server) => (
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
                                                marginLeft: '10px',
                                            }}
                                        ></div>
                                    </td>
                                    <td>{server.ip_address}</td>
                                    <td>{server.server_name}</td> 
                                    <td>{server.access_group}</td> 
                                    <td>
                                        <div style={{
                                            ...getPriorityStyle(server.priority),
                                            backgroundColor: 'transparent',
                                            borderRadius: '15px',
                                            padding: '5px 10px',
                                            fontSize: '12px',
                                            display: 'inline-block',
                                            color: getPriorityStyle(server.priority).color,
                                        }}>
                                         {server.priority}
                                        </div>
                                    </td> 
                                    <td>{server.status}</td>
                                    <td>{server.last_ping}</td>
                                    <td>
                                        <div className="delete-icon" onClick={() => handleDeleteServer(server.ip_address)}>
                                            <MdOutlineDelete />
                                        </div>
                                    </td>
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
