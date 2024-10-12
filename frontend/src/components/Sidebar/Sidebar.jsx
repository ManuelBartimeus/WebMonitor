import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'
import { FiHome } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiDashboard2Line } from "react-icons/ri";
import { LuSettings } from "react-icons/lu";

const Sidebar = () => {
  return (
    <div className='sidebar-container'>

      <div className="user-container">
        <div className="user-text">
          <h2>Kwadwo Boateng</h2>
          <h3>1212422</h3>
        </div>
      </div>
      <hr />

      <div className="sidebar-lower-container">
        <div className="icon-container">
          <FiHome />
          <Link to="./Home">Home</Link>
        </div>

        <div className="icon-container">
          <LuLayoutDashboard />
          <Link to="./Dashboard">Dashboard</Link>
        </div>

        <div className="icon-container">
          <RiDashboard2Line />
          <Link to="./Monitor">Monitor</Link>
        </div>

        <div className="icon-container">
          <LuSettings />
          <Link to="./Settings">Settings</Link>
        </div>

      
      </div>
    
    </div>
  );
};

export default Sidebar;
