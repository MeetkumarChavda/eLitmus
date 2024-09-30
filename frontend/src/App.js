import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Page/Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';  
import Exam from './components/Exam';  
import Auth from './components/Auth';  
import CreateExam from './components/CreateExam';
import { useState, useEffect } from 'react';
import AllExams from './components/AllExams';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const [csrfToken, setCsrfToken] = useState(''); // State to hold CSRF token

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const currentUserId = localStorage.getItem('user_id');

  return (
    <Router>
      <div className="app-container flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar with toggleSidebar function */}
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          {/* Main Content */}
          <div className='p-5'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile userId={currentUserId}/>} />
              <Route path="/exam/:examId" element={<Exam />} />
              <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/create-exam" element={<CreateExam csrfToken={csrfToken} />} />
              <Route path="/exams" element={<AllExams />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
