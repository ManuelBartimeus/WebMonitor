import React, { useState } from 'react';
import './AddServerModal.css'; 
import validator from 'validator'; // Import the validator package
import axios from 'axios'; // Import axios for making API requests

const AddServerModal = ({ onClose, onAdd }) => {
    const [ipAddress, setIpAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const handleAdd = async () => {
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
        
        try {
            // Call the onAdd function passed as a prop to add the server
            await onAdd(ipAddress);
            setIpAddress(''); // Clear the input field
            onClose(); // Close the modal
        } catch (error) {
            setErrorMessage('Failed to add server. Please try again.'); // Handle any errors during addition
        }
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
