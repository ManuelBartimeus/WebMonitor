import React, { useState } from 'react';
import './FilterDropdown.css';

const FilterDropdown = ({ onFilterSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');

    const filters = [
        'None',
        'Access Group',
        'Priority',
        'Status',
    ];

const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    onFilterSelect(filter);
    setIsOpen(false); 
};

    return (
        <div className="filter-dropdown">
            <button className="filter-btn" onClick={() => setIsOpen(!isOpen)}>
                Filter {selectedFilter && `: ${selectedFilter}`} 
            </button>
            {isOpen && (
                <div className="filter-container">
                    {filters.map((filter) => (
                        <div key={filter} className="filter-item" onClick={() => handleFilterSelect(filter)}>
                            {filter}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
