import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateExam = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [examDate, setExamDate] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], answer: '' }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = event.target.value;
    // console.log(index, 'answer', event.target.value);
    setQuestions(newQuestions);
  };

  // const handleAnswerChange = (index, event) => {
  //   const newQuestions = [...questions];
  //   console.log(index, 'answer', event.target.value);
  //   newQuestions[index].answer = Number(event.target.value);  // Ensure it's stored as a number
  //   setQuestions(newQuestions);
  // };// (_,i)  ---> _ repnt question , i --> index

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], answer: '' }]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (questions.length < 1 || questions[0].text.trim() === '') {
        alert('You must add at least one question.');
        return;
    }
  
    const userId = localStorage.getItem('user_id'); // Get the creator's user ID
  
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

    try {
      const response = await fetch(`http://localhost:8000/api/exams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrfToken'),
        },
        body: JSON.stringify({
          title: examTitle,
          description: examDescription,
          date: examDate,
          created_by: userId,  // Include the creator's ID
        }),
      });
  
      if (!response.ok) throw new Error('Failed to create exam');
      const exam = await response.json();
  
      // Create each question for the exam
      for (const question of questions) {
        await fetch(`http://localhost:8000/api/exams/${exam.id}/questions/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrfToken'),
          },
          body: JSON.stringify({
            text: question.text,
            option1: question.options[0],
            option2: question.options[1],
            option3: question.options[2],
            option4: question.options[3],
            answer: question.answer,
            exam: exam.id,
          }),
        });
      }
  
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create Exam</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <label className="block mb-2">Exam Title:</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2">Description:</label>
          <textarea
            value={examDescription}
            onChange={(e) => setExamDescription(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2">Date:</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            required
          />
        </div>

        {questions.map((question, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 mb-2">
            <label className="block mb-2">Question:</label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(index, e)}
              className="border border-gray-300 rounded p-2 w-full mb-2"
              required
            />
            <label className="block mb-2">Options:</label>
            {question.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, optIndex, e)}
                className="border border-gray-300 rounded p-2 w-full mb-2"
                required
              />
            ))}
            <label className="block mb-2">Correct Answer (1-4):</label>
            <input
              type="number"
              value={question.answer}
              onChange={(e) => handleAnswerChange(index, e)}
              onWheel={(e) => e.target.blur()}
              className="border border-gray-300 rounded p-2 w-full mb-2"
              required
            />
            {/* <h1>{question.answer}</h1> */}
            <button
              type="button"
              onClick={() => deleteQuestion(index)}
              className="bg-red-500 text-white px-4 py-1 rounded mt-2"
            >
              Delete Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Question
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
