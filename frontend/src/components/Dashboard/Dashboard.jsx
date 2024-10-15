import React from 'react';
import './Dashboard.css'; // Import CSS for styling
import { IoMdInformationCircleOutline } from 'react-icons/io';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="analytics-header">
        <h2>Dashboard<IoMdInformationCircleOutline /></h2>
        <span>Last 30 days</span>
      </div>

      <div className="engaged-users-section">
        <h3>Engaged users</h3>
        <div className="toggle-users">
          <label>
            <input type="radio" name="users" />
            Retaining engaged customers
          </label>
          <label>
            <input type="radio" name="users" />
            Total engaged users
          </label>
          <label>
            <input type="radio" name="users" />
            New engaged customers
          </label>
        </div>
        <div className="chart">
          {/* You can add a chart library here for dynamic charting, like Chart.js */}
          <img src="/path/to/your/line-chart-placeholder.png" alt="Engaged Users Chart" />
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h4>80%</h4>
          <p>CSAT score</p>
          <div className="gauge-chart">
            {/* Placeholder for gauge chart */}
            <img src="/path/to/gauge-chart-1.png" alt="CSAT score" />
          </div>
          <div className="legend">
            <span>Happy: 733</span>
            <span>Not happy: 199</span>
          </div>
        </div>

        <div className="stat-card">
          <h4>50%</h4>
          <p>Response rate</p>
          <div className="gauge-chart">
            {/* Placeholder for gauge chart */}
            <img src="/path/to/gauge-chart-2.png" alt="Response rate" />
          </div>
          <div className="legend">
            <span>Responded: 486</span>
            <span>Scored only: 251</span>
            <span>Score and comment: 245</span>
            <span>Not responded: 486</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
