import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call your logout API or clear session data here
    fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
    })
    .then(response => {
      if (response.ok) {
        setIsAuthenticated(false); // Update the authentication state
        navigate('/'); // Redirect to home after logout
      } else {
        // Handle error if needed
        console.error('Logout failed');
      }
    })
    .catch(err => console.error('Error:', err));
  };

  return (
    <div className={`bg-gray-900 text-white h-screen transition-all duration-700 ${isOpen ? 'w-64' : 'w-0'}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-center p-4">
        <img src="/elitmus_log.png" alt="Logo" className="h-12 w-40 block" />
      </div>

      {/* Sidebar Links */}
      <ul className="mt-4 space-y-4">
        <li>
          <Link to="/" className="flex items-center p-2 hover:bg-gray-700">
            <h1 className="material-icons mr-2">Home</h1>
          </Link>
        </li>
        
        {isAuthenticated ? (<>
          <li>
            <Link to="/profile" className="flex items-center p-2 hover:bg-gray-700">
              <h1 className="material-icons mr-2">Profile</h1>
            </Link>
          </li>
          <li>
            <Link to="/create-exam" className="flex items-center p-2 hover:bg-gray-700">
              <h1 className="material-icons mr-2">Create Exam</h1>
            </Link>
          </li>
          <li>
            <Link to="/exams" className="flex items-center p-2 hover:bg-gray-700">
              <h1 className="material-icons mr-2">Exams</h1>
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="flex items-center p-2 hover:bg-gray-700 w-full text-left">
              <h1 className="material-icons mr-2">LogOut</h1>
            </button>
          </li>
        </>) : (
          <li>
            <Link to="/auth" className="flex items-center p-2 hover:bg-gray-700">
              <h1 className="material-icons mr-2">LogIn</h1>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
