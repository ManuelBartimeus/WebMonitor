import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ServerDetail.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import chart1 from './chart1.png';
import chart2 from './chart2.png';
import chart3 from './chart3.png';

const ServerDetail = () => {
    const { ip } = useParams(); 

    const [logs, setLogs] = useState([]);

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

            <div className="overview-section">
                <hr></hr>
                <h4>Server Name: {ip}</h4>
                <h4>Server IP Address: {ip} </h4>
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
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>

    );
};

export default ServerDetail;


