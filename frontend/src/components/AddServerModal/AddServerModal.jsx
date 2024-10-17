import React, { useState } from 'react';
import './AddServerModal.css'; 

const AddServerModal = ({ onClose, onAdd }) => {
    const [ipAddress, setIpAddress] = useState('');

    const handleAdd = () => {
        if (ipAddress) {
            onAdd(ipAddress);
            setIpAddress(''); 
            onClose(); 
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
                <button onClick={handleAdd}>Add</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddServerModal;
