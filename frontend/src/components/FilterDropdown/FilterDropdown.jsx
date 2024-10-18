import React, { useState, useRef, useEffect } from 'react';
import './FilterDropdown.css';

const FilterDropdown = ({ onFilterSelect }) => {
    const [isOpen, setIsOpen] = useState(false); // Controls dropdown visibility
    const [selectedFilter, setSelectedFilter] = useState(''); // Stores the selected filter
    const [sidebarVisible, setSidebarVisible] = useState(false); // Controls first sidebar visibility
    const [secondSidebarVisible, setSecondSidebarVisible] = useState(false); // Controls second sidebar visibility
    const [sidebarItems, setSidebarItems] = useState([]); // Stores the items to be displayed in the first sidebar
    const [secondSidebarItems, setSecondSidebarItems] = useState([]); // Stores the items for the second sidebar
    const dropdownRef = useRef(null); // Reference for the dropdown
    const sidebarRef = useRef(null); // Reference for the sidebars

    // Filter options in the dropdown menu
    const filters = [
        'Access Group',
        'Priority',
        'Status',
    ];

    // Options to be displayed in the first sidebar based on filter selection
    const accessGroupOptions = [
        'IT Infrastructure',
        'Active Management',
        'Database Management',
        'Networking',
        'Public Relations',
        'Application Development',
        'Business Operations',
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

    // Handles filter selection and updates the sidebar with relevant options
    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        setIsOpen(false); // Close the dropdown

        // Display corresponding sidebar menu based on filter selected
        if (filter === 'Access Group') {
            setSidebarItems(accessGroupOptions);
            setSecondSidebarVisible(false); // Close second sidebar if it was open
        } else if (filter === 'Priority') {
            setSidebarItems(priorityOptions);
            setSecondSidebarVisible(false); // Close second sidebar if it was open
        } else if (filter === 'Status') {
            setSidebarItems(statusOptions);
            setSecondSidebarVisible(false); // Close second sidebar if it was open
        }

        setSidebarVisible(true); // Show the first sidebar
    };

    // Handles option selection in the first sidebar
    const handleSidebarSelect = (item) => {
        console.log(`Selected: ${item}`);
        setSidebarVisible(true); // Close the first sidebar
        setSecondSidebarVisible(true); // Open the second sidebar

        // Set the second sidebar items based on the selected item from the first sidebar
        if (selectedFilter === 'Access Group') {
            setSecondSidebarItems(['IT Infrastructure', 'Active Management', 'Database Management', 'Networking']);
        } else if (selectedFilter === 'Priority') {
            setSecondSidebarItems(['Critical', 'High Priority', 'Important']);
        } else if (selectedFilter === 'Status') {
            setSecondSidebarItems(['Active', 'Inactive']);
        }
    };

    // Handles click events outside of the dropdown and sidebars
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target)
        ) {
            setIsOpen(false); // Close dropdown
            setSidebarVisible(false); // Close first sidebar
        }
    };

    // Effect to handle clicks outside the component
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="filter-dropdown" ref={dropdownRef}>
            {/* Filter Button */}
            <button className="filter-btn" onClick={() => setIsOpen(!isOpen)}>
                Filter
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="filter-container">
                    {filters.map((filter) => (
                        <div key={filter} className="filter-item" onClick={() => handleFilterSelect(filter)}>
                            {filter}
                        </div>
                    ))}
                </div>
            )}

            {/* First Sidebar Menu */}
            {sidebarVisible && (
                <div className="sidebar-menu" ref={sidebarRef}>
                    <div className="filter-container">
                        {sidebarItems.map((item, index) => (
                            <div key={index} className="filter-item" onClick={() => setSidebarVisible(false)}>
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
