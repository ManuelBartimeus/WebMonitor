import React, { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';

const FilterDropdown = ({ onFilterSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarItems, setSidebarItems] = useState([]);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    const filters = [
        'Access Group',
        'Priority',
        'Status',
    ];

    const accessGroupOptions = [
        'IT Infrastructure',
        'Active Management',
        'Database Services',
        'Research & Development',
        'HR',
        'Finance',
        'Marketing',
        'Sales',
        'Customer Support',
    ];

    const priorityOptions = [
        'Critical',
        'High Priority',
        'Important',
        'Standard',
        'Low Priority',
        'Decommissioned',
    ];

    const statusOptions = [
        'Active',
        'Inactive',
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setSidebarVisible(true);
        setSidebarItems(filter === 'Access Group' ? accessGroupOptions : filter === 'Priority' ? priorityOptions : statusOptions);
        setIsOpen(false);
    };

    const handleOptionSelect = (option) => {
        onFilterSelect(selectedFilter, option);
        setSelectedFilter('');
        setSidebarVisible(false);
    };

    return (
        <div className="filter-dropdown" ref={dropdownRef}>
            <button className="filter-btn" onClick={() => setIsOpen(!isOpen)}>
                Filter
            </button>

            {isOpen && (
                <div className="filter-container">
                    {filters.map((filter) => (
                        <div key={filter} onClick={() => handleFilterChange(filter)} className="filter-item">
                            {filter}
                        </div>
                    ))}
                </div>
            )}

            {sidebarVisible && (
                <div className="sidebar-menu" ref={sidebarRef}>
                    <div className="filter-container">
                        {sidebarItems.map((item) => (
                            <div key={item} onClick={() => handleOptionSelect(item)} className="filter-item">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
