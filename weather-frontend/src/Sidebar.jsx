import React from "react";
import { NavLink } from "react-router-dom";
import { FaSearch, FaDatabase } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-hover-zone"></div>
      <div className="sidebar">
        <NavLink to="/" className="nav-icon">
          <FaSearch />
          <span> Search</span>
        </NavLink>
        <NavLink to="/stored" className="nav-icon">
          <FaDatabase />
          <span> Stored</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
