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
        'None',
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
        'High',
        'Medium',
        'Low',
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
        if (filter !== 'None') {
            setSidebarVisible(true);
            setSidebarItems(filter === 'Access Group' ? accessGroupOptions : filter === 'Priority' ? priorityOptions : statusOptions);
        } else {
            setIsOpen(false);
            setSidebarVisible(false); // Close sidebar if 'None' is selected
            onFilterSelect('', '');
        }
        setIsOpen(false); // Close the dropdown
    
    };

    const handleOptionSelect = (option) => {
        if (option !== 'None') {
            setIsOpen(false);
            setSidebarVisible(false);
            onFilterSelect(selectedFilter, option);
        }
        setSelectedFilter(option === 'None' ? 'None' : ''); // Keep 'None' in the state for clarity
        setSidebarVisible(false); // Ensure sidebar is hidden
        setIsOpen(false);         // Close the dropdown
    
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
