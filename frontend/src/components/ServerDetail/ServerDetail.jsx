import React from 'react';
import { useParams } from 'react-router-dom';
import './ServerDetail.css';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import chart1 from './chart1.png';
import chart2 from './chart2.png';
import chart3 from './chart3.png';

const ServerDetail = () => {
    const { ip } = useParams(); 

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
                        <img src={chart3} alt="Server Uptime Chart" />
                    </div>
                </div>

                <div className="stat-card">
                    <h4>CPU Usage</h4>
                    <div className="pie-chart">
                        <img src={chart1} alt="CPU Usage Chart" />
                    </div>
                </div>

                <div className="stat-card">
                    <h4>Disk Usage</h4>
                    <div className="pie-chart">
                        <img src={chart1} alt="Disk Usage Chart" />
                    </div>
                </div>

            </div>
        </div>

    );
};

export default ServerDetail;


