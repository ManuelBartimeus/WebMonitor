import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './Monitor.css';
import AddServerModal from '../AddServerModal/AddServerModal';
import ExportModal from '../ExportModal/ExportModal';
import Search from '../Search/Search';
import { MdOutlineDelete } from "react-icons/md";
import FilterDropdown from '../FilterDropdown/FilterDropdown';
import { IoFilterCircleOutline } from "react-icons/io5";
import { LuSearchX } from "react-icons/lu";

const Monitor = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [selectedFilterValue, setSelectedFilterValue] = useState('');

    const fetchServers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/servers/');
            setServers(response.data);
            setError(null);
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
            document.body.removeChild(script);
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
            setServers((prevServers) => prevServers.filter(server => server.ip_address !== ipAddress));
        } catch (err) {
            console.error('Failed to delete server:', err);
        }
    };

    const filteredServers = servers.filter(server => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = (
            server.ip_address.toLowerCase().includes(lowerCaseSearchTerm) ||
            server.status.toLowerCase().includes(lowerCaseSearchTerm) ||
            server.last_ping.toLowerCase().includes(lowerCaseSearchTerm)
        );

        const matchesFilter = selectedFilter === '' && selectedFilterValue === '' ? 
        true : // When 'None' is selected, return true to show all records
        (selectedFilter === 'Access Group' ? server.access_group === selectedFilterValue :
        selectedFilter === 'Priority' ? server.priority === selectedFilterValue :
        selectedFilter === 'Status' ? server.status === selectedFilterValue : true);

    return matchesSearch && matchesFilter;

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

    const handleFilterSelect = (filter, value) => {
        setSelectedFilter(filter);
        setSelectedFilterValue(value);

        // Fetch all records if 'None' is selected
        if (filter === 'None' && value === '') {
            fetchServers(); // Fetch all records
        } else {
            setSidebarVisible(true); // Show sidebar for other filters
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
                <FilterDropdown onFilterSelect={handleFilterSelect} />
                <div className="filter-icon">
                    <p><IoFilterCircleOutline className = "custome-filter-icon"/>
                    {selectedFilterValue}</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <dotlottie-player 
                        src="https://lottie.host/c7bc1931-f10a-42df-a962-6f47e6238daf/Mf2qmJCbvV.json" 
                        background="transparent" 
                        speed="1" 
                        style={{ width: '400px', height: '400px' }} 
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
            ) : filteredServers.length === 0 ? (
                <div className="no-records-container">
                    <LuSearchX className="no-records-icon" />
                    <p>No records found</p>
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
                                    <td>
                                        <Link to={`/server/${server.ip_address}`}>{server.ip_address}</Link>
                                    </td>
                                    <td>
                                        <Link to={`/server/${server.ip_address}`}>{server.server_name}</Link>
                                    </td> 
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
