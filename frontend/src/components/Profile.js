import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ userId }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile_photo, setFile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  };

  useEffect(() => {
    const fetchUserProfileAndResults = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch(`http://localhost:8000/api/users/${userId}/`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
        setEmail(profileData.email);
        console.log(profileData.profile_image)
        // Fetch user results
        const resultsResponse = await fetch(`http://localhost:8000/api/users/${userId}/results/`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
        if (!resultsResponse.ok) throw new Error('Failed to fetch results');
        const resultsData = await resultsResponse.json();

        // Fetch exam details for each result
        const resultsWithExamDetails = await Promise.all(resultsData.map(async (result) => {
          const examResponse = await fetch(`http://localhost:8000/api/exams/${result.exam}/`, {
            credentials: 'include',
            headers: {
              'X-CSRFToken': getCookie('csrftoken'),
            },
          });
          if (!examResponse.ok) throw new Error('Failed to fetch exam details');
          const examData = await examResponse.json();
          return { ...result, exam: examData };
        }));

        setResults(resultsWithExamDetails);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUserExams = async () => {
      try {
        const examsResponse = await fetch(`http://localhost:8000/api/users/${userId}/exams/`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
        if (!examsResponse.ok) throw new Error('Failed to fetch exams');
        const examsData = await examsResponse.json();
        setExams(examsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfileAndResults();
    fetchUserExams();
  }, [userId]);

  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/exams/${examId}/`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Add CSRF token in the headers
          },
        });
        if (!response.ok) throw new Error('Failed to delete exam');
        
        // Update the state to remove the deleted exam
        setExams(exams.filter(exam => exam.id !== examId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Set the Base64 string
      };
      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    }
    // console.log(profile_photo)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const formData = new FormData(); // Create a new FormData object
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (profile_photo) formData.append('profile_photo', profile_photo); // Append the file
    console.log(profile_photo)
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}/edit/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ email, password, profile_photo }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-container p-4">
      {error && <p className="text-red-500">{error}</p>}
      {userProfile && (
        <div>
          <h1 className="text-2xl font-bold">{userProfile.username}'s Profile</h1>
          <p>Email: {userProfile.email}</p>
          <img src={userProfile.profile_image} alt='profile_image' className=' rounded-full border-[5px] border-black w-[20vw] ' />
          <button onClick={handleEditToggle} className="mt-2 text-blue-500 underline">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      )}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">Change Profile Image:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
        </form>
      )}
      <h2 className="text-xl font-semibold mt-4">Exam Results</h2>
      {results && 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {results.map((result) => (
            <div key={result.id} className="border border-gray-300 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold">{result.exam.title}</h3>
              <p>Score: {result.score}</p>
              <p>Completed At: {new Date(result.completed_at).toLocaleString()}</p>
              <button
                onClick={() => handleExamClick(result.exam.id)}
                className="mt-2 bg-blue-500 text-white p-2 rounded"
              >
                Retry Exam
              </button>
            </div>
          ))}
        </div>
      }
      {results.length < 1 && 
        <div className="border border-gray-300 rounded-lg shadow-md p-4">
          <h1>No Data Found</h1>
        </div>
      }
      <h2 className="text-xl font-semibold mt-4">Created Exams</h2>
      {exams && 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {exams.map((exam) => (
            <div key={exam.id} className="border border-gray-300 rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold">{exam.title}</h3>
              <button
                onClick={() => handleDeleteExam(exam.id)}
                className="mt-2 bg-red-500 text-white p-2 rounded"
              >
                Delete Exam
              </button>
            </div>
          ))}
        </div>
      }
      {exams.length < 1 && 
        <div className="border border-gray-300 rounded-lg shadow-md p-4">
          <h1>No Exams Created</h1>
        </div>
      }
    </div>
  );
};

export default Profile;
