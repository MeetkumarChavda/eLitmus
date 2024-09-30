import React from 'react';
import { IoMenuOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <div className="w-full h-16 bg-gray-800 flex items-center justify-between px-4">
      {/* Sidebar Toggle Icon */}
      <button onClick={toggleSidebar} className="text-white text-3xl">
        <span className="material-icons">
          {sidebarOpen ? <IoMdClose/> : <IoMenuOutline/>}
        </span>
      </button>
      
      {/* Logo */}
      <div className={`text-white text-2xl font-bold ${sidebarOpen ? 'hidden': 'block'} flex items-center justify-center p-4`}>
        <Link to={'/'}><img src="/elitmus_log.png" alt="Logo" className={'h-12 w-40 block'} /></Link>
      </div>
    </div>
  );
};

export default Navbar;
