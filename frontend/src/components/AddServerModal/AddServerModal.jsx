import React, { useState } from 'react';
import './AddServerModal.css'; 
import validator from 'validator'; // Import the validator package

const AddServerModal = ({ onClose, onAdd }) => {
    const [ipAddress, setIpAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const handleAdd = () => {
        // Validate the IP address
        if (!ipAddress) {
            setErrorMessage('IP Address is required.');
            return;
        }

        // Check if the IP address is valid (IPv4 or IPv6)
        if (!validator.isIP(ipAddress)) {
            setErrorMessage('Invalid IP Address. Please enter a valid IPv4 or IPv6 address.');
            return;
        }

        // Reset error message and proceed to add the server
        setErrorMessage(''); // Clear any previous error messages
        onAdd(ipAddress);
        setIpAddress('');
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Server</h2>
                <input
                    type="text"
                    placeholder="Enter IP Address"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button onClick={handleAdd}>Add</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddServerModal;
