import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllExams = () => {
  const [exams, setExams] = useState([]);
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
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/exams/',{
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrfToken'),
              },
        });
        if (!response.ok) throw new Error('Failed to fetch exams');
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchExams();
  }, []);

  const handleExamClick = (examId) => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Exams</h1>
      {exams.map((exam) => (
        <div
          key={exam.id}
          className="border border-gray-300 rounded-lg shadow-md p-4 mb-4 cursor-pointer"
          onClick={() => handleExamClick(exam.id)}
        >
          <h3 className="text-lg font-bold">{exam.title}</h3>
          <p>{exam.description}</p>
          <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AllExams;
