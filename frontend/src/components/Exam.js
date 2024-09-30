import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Exam = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(null);  // Store attempts
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

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
  /**
   * 
   * credentials: 'include': This ensures that cookies (including session cookies or other authentication tokens) 
   * are sent along with the request. Even though the request is to an API endpoint (potentially on a different origin),
   *  cookies will be included to maintain the user's session or send authentication information.
   */

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/exams/${examId}/questions/`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttempts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/results/`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCookie('csrftoken'),
          },
        });
        if (response.ok) {
          const data = await response.json();
          const matchingResult = data.find(result => result.exam === parseInt(examId));
          if (matchingResult) {
            setAttempts(matchingResult.attempts);  // Set attempts from existing result
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuestions();
    fetchAttempts();  // Fetch attempts on component load
  }, [examId, userId]);

  const handleChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let totalScore = 0;
    for (const question of questions) {
      if (answers[question.id] === question.answer) {
        totalScore += 1;
      }
    }
    const percentageScore = (totalScore / questions.length) * 100;
    setScore(percentageScore);
    setIsDialogOpen(true);
  
    try {
      const existingResultResponse = await fetch(`http://localhost:8000/api/users/${userId}/results/`, {
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
  
      let response;
      if (existingResultResponse.ok) {
        const existingResults = await existingResultResponse.json();
        const matchingResult = existingResults.find(result => result.exam === parseInt(examId));
  
        if (matchingResult) {
          const resultId = matchingResult.id;
          // Check if the new score is greater than or equal to the previous best score
          if (percentageScore >= matchingResult.score) {
            // console.log(matchingResult.score)
            // console.log(percentageScore)
            const updateData = {
              exam: examId,
              score: percentageScore,  // Update with the new score
              attempts: matchingResult.attempts + 1,  // Increment attempts
              completed_at: new Date().toISOString(),  // Update completed_at since the score is the same or better
            };
  
            response = await fetch(`http://localhost:8000/api/users/${userId}/results/${resultId}/`, {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify(updateData),
            });
          } else {
            // If the score is less than the previous score, only update the attempts
            const updateData = {
              exam: examId,
              attempts: matchingResult.attempts + 1,  // Increment attempts
              completed_at: matchingResult.completed_at,
            };

            response = await fetch(`http://localhost:8000/api/users/${userId}/results/${resultId}/`, {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify(updateData),
            });
          }
        } else {
          // First attempt, create new result
          response = await fetch(`http://localhost:8000/api/users/${userId}/results/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
              user: userId,
              exam: examId,
              score: percentageScore,
              attempts: 1,  // First attempt
              completed_at: new Date().toISOString(),  // Set initial completion time
            }),
          });
        }
  
        if (!response.ok) throw new Error('Failed to submit result');
        const result = await response.json();
        setAttempts(result.attempts);  // Update attempts in the state
      } else {
        throw new Error('Failed to fetch existing results');
      }
    } catch (err) {
      setError(err.message);
    }
  };    

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    navigate(`/profile`);
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="exam-container p-4">
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold">Exam Questions</h1>
      {attempts !== null && <p>Attempts: {attempts}</p>}  {/* Display the attempts */}
      <form onSubmit={handleSubmit} className="mt-4">
        {questions.map((question) => (
          <div key={question.id} className="border-2 border-gray-600 rounded-lg p-4 mb-4">
            <p className="font-semibold border-b-2 pb-2">{question.text}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {Array.from({ length: 4 }, (_, index) => (
                <label key={index} className="flex items-center border border-gray-400 p-2">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={index + 1}
                    onChange={() => handleChange(question.id, index + 1)}
                    checked={answers[question.id] === index + 1}
                    className="mr-2"
                    required
                  />
                  Option {index + 1}: {question[`option${index + 1}`]}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
          Submit Exam
        </button>
      </form>
      {isDialogOpen && (
        <div className="dialog-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4">
            <p>Exam submitted successfully!</p>
            <p>Score: {score}%</p>
            <p>Attempts: {attempts}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4" onClick={handleDialogClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
