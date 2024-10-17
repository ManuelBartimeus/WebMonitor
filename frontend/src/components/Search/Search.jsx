import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input" 
        />
    );
};

export default Search;
