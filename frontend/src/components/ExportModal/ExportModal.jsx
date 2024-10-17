import React from 'react';
import './ExportModal.css';

const ExportModal = ({ onClose, data }) => {
    const exportToCSV = () => {
        const csvRows = [];
        const headers = ['IP Address', 'Status', 'Time Log']; // Update headers according to your data
        csvRows.push(headers.join(','));

        data.forEach(server => {
            const row = [server.ip_address, server.status, server.last_ping].join(',');
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

export default ExportModal;
