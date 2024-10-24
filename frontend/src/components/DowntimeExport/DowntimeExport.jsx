import React from 'react';
import './DowntimeExport.css';

const DowntimeExport = ({ onClose, data }) => {
    const exportToCSV = () => {
        const csvRows = [];
        const headers = ['Timestamp', 'Duration', 'Reason']; // Update headers according to your data
        csvRows.push(headers.join(','));

        data.forEach(log => {
            const row = [log.timestamp, log.duration, log.reason].join(',');
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'servers.csv');
        link.click();
    };

    return (
        <div className="export-modal">
            <div className="export-modal-content">
                <h3>Export Server Data</h3>
                <p>Export the current monitoring data</p>
                <button onClick={exportToCSV}>Export as CSV</button>
                {/* You can implement Excel export here if needed */}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default DowntimeExport;
