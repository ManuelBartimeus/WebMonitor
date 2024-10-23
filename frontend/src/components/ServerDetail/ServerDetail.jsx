import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ServerDetail.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { GrInbox } from "react-icons/gr";
import chart1 from '../../assets/chart1.png';
import chart2 from '../../assets/chart2.png';
import chart3 from '../../assets/chart3.png';
import { FaChevronDown } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { MdInfoOutline } from "react-icons/md";


const ServerDetail = () => {
    const { ip } = useParams(); 
    const location = useLocation();
    const { serverName } = location.state || {};

    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);  // State to manage modal visibility
    const [receiveAlerts, setReceiveAlerts] = useState(false); // State for toggle button
    const [alertFrequency, setAlertFrequency] = useState('1 minute'); // Default value for frequency
    const [alertDelay, setAlertDelay] = useState('No Delay'); // Default value for delay

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/logs/${ip}/`);
                setLogs(response.data.logs);
            } catch (error) {
                console.error("Error fetching logs", error);
            }
        };
        fetchLogs();
    }, [ip]);

    return (
        <div className="server-detail-container">
            <h2>Server Details<IoMdInformationCircleOutline /></h2>

            <hr />
            <div className="overview-section">
                <div className="server-info">
                    <h3 className="info-header">Server Name:&nbsp;&nbsp;</h3>
                    <h4>{serverName || "Unknown Server Name"}</h4> 
                </div>

                <div className="server-info">
                    <h3 className="info-header">IP Address:&nbsp;&nbsp;</h3>
                    <h4>{ip}</h4>
                </div>

                {/* Email Settings Button */}
                <div className="email-settings">
                    <button 
                        className="alert-button" 
                        onClick={() => setIsModalOpen(true)} // Open modal on click
                    >
                        <div className="alert-icon">
                            <p>Alert Settings <FaChevronDown /></p>
                        </div>
                    </button>
                </div>

                {/* Modal for Email Settings */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>  {/* Close modal when clicking outside */}
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>  {/* Prevent modal close when clicking inside */}
                            <div className="modal-header">
                                <h3>Alert Settings</h3>
                                <button className="close-button" onClick={() => setIsModalOpen(false)}><IoCloseCircle /></button>
                            </div>
                            <hr />
                            <div className="modal-body">
                                <div className="toggle-container">
                                    <span>Receive Email Alerts</span>
                                    <div 
                                        className={`toggle-button ${receiveAlerts ? 'active' : ''}`} 
                                        onClick={() => setReceiveAlerts(!receiveAlerts)}
                                        style={{
                                            backgroundColor: receiveAlerts ? '#c31a21' : 'gray',
                                            width: '50px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            position: 'relative',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div 
                                            className="toggle-knob" 
                                            style={{
                                                backgroundColor: 'white',
                                                height: '20px',
                                                width: '20px',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '2px',
                                                left: receiveAlerts ? '28px' : '2px',
                                                transition: 'left 0.2s',
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="dropdown-group">
                                    <label>Alert Frequency:</label>
                                    <select 
                                        value={alertFrequency} 
                                        onChange={(e) => setAlertFrequency(e.target.value)}
                                    >
                                        <option value="Default">Default</option>
                                        <option value="1 minute">Every 1 minute</option>
                                        <option value="5 minutes">Every 5 minutes</option>
                                        <option value="10 minutes">Every 10 minutes</option>
                                        <option value="30 minutes">Every 30 minutes</option>
                                    </select>
                                    <div className="label-info-container">
                                        <p className="label-info"><MdInfoOutline />Frequency for alert notification during server downtime</p>
                                    </div>
                                </div>
                                <div className="dropdown-group">
                                    <label>Alert Delay:</label>
                                    <select 
                                        value={alertDelay} 
                                        onChange={(e) => setAlertDelay(e.target.value)}
                                    >
                                        <option value="No Delay">No Delay</option>
                                        <option value="1 minute">1 minute</option>
                                        <option value="5 minutes">5 minutes</option>
                                        <option value="10 minutes">10 minutes</option>
                                    </select>
                                    <div className="label-info-container">
                                        <p className="label-info"><MdInfoOutline />Notification buffer time after first server failure</p>
                                    </div>
                                </div>

                                <div className="modal-button">
                                    <button className="modal-button-save">Save</button>
                                    <button className="modal-button-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="stats-section">
                <div className="stat-card">
                    <h4>Server Uptime</h4>
                    <div className="pie-chart">
                        <div>
                            <img src={chart1} alt="Server Uptime Chart" />
                            <p>40:00</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <h4>CPU Usage</h4>
                    <div className="pie-chart">
                        <img src={chart2} alt="CPU Usage Chart" />
                        <p>35%</p>
                    </div>
                </div>

                <div className="stat-card">
                    <h4>Disk Usage</h4>
                    <div className="pie-chart">
                        <img src={chart3} alt="Disk Usage Chart" />
                        <p>76%</p>
                    </div>
                </div>
            </div>

            <div className="logs-section">
                <h4>Downtime Logs</h4>
                {logs.length === 0 ? ( 
                    <div className="no-logs">
                        <GrInbox className="no-logs-icon" size={40}/> 
                        <p>No logs available</p> 
                    </div>
                ) : (
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Timestamp</th>
                                <th>Duration</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index}>
                                    <td>
                                        <div
                                            className="status-dot"
                                            style={{
                                                backgroundColor: '#5a5d59',
                                                height: '10px',
                                                width: '10px',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                marginLeft: '10px',
                                            }}
                                        ></div>
                                    </td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.duration}</td>
                                    <td>{log.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ServerDetail;
