import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState(''); // For signup form
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // k=v, k=v, k-v formate also space between v, and k
  // Utility Function
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const url = 'http://localhost:8000/api/login/';
    const data = { username, password };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const userId = responseData.id; // Accessing the user ID
        localStorage.setItem('user_id', userId); // Storing user ID in localStorage
        alert('User Logged in!')
        setIsAuthenticated(true);
        navigate('/'); // Redirect to home or dashboard
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    const url = 'http://localhost:8000/api/signup/';
    const data = { username, password, password2 };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.error || 'Something went wrong.');
        // Optionally handle successful signup (e.g., auto-login or show a message)
        alert('User Registered! plz LogIn')
        setIsLogin(true)
        navigate('/auth'); // Redirect to home or dashboard
      } else {
        const responseData = await response.json();
        setError(responseData.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('An error occurred.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin ? handleLogin(e) : handleSignup(e);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full p-2 bg-green-700 text-white rounded hover:bg-green-900"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={toggleForm}
            className="text-blue-500 underline"
          >
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
