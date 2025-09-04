import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { shuffle } from '../utils';
import { sampleQuestions } from '../data/sampleQuestions';

const QuizGame = ({ config, onComplete }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentSelection, setCurrentSelection] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestions();
    initializeTimer();
  }, [config]);

  // Update currentSelection when navigating between questions
  useEffect(() => {
    setCurrentSelection(selectedAnswers[currentQuestionIndex] ?? null);
  }, [currentQuestionIndex, selectedAnswers]);

  const initializeTimer = () => {
    console.log('Timer config received:', config.timer);
    
    // Ensurinf if we have valid numbers
    const hours = parseInt(config.timer?.hours) || 0;
    const minutes = parseInt(config.timer?.minutes) || 0;
    const seconds = parseInt(config.timer?.seconds) || 0;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    console.log('Parsed timer:', { hours, minutes, seconds, totalSeconds });
    
    // If total is 0, default to 2 minutes as per your original config
    const finalSeconds = totalSeconds > 0 ? totalSeconds : 120;
    
    console.log('Timer set to:', finalSeconds, 'seconds');
    setTimeRemaining(finalSeconds);
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !loading && questions.length > 0) {
      // Only auto-complete if quiz has actually started
      handleQuizComplete();
    }
  }, [timeRemaining, loading, questions.length]);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let apiUrl = `https://opentdb.com/api.php?amount=${config.amount}&type=${config.type}&difficulty=${config.difficulty}`;
      if (config.category) {
        apiUrl += `&category=${config.category}`;
      }

      console.log('Fetching questions from:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.results && data.results.length > 0) {
        const formattedQuestions = data.results.map(q => {
          const allAnswers = config.type === 'multiple' 
            ? [...q.incorrect_answers, q.correct_answer]
            : ['True', 'False'];
          
          const shuffledAnswers = shuffle(allAnswers);
          const correctIndex = shuffledAnswers.findIndex(answer => answer === q.correct_answer);
          
          return {
            question: decodeHTMLEntities(q.question),
            options: shuffledAnswers.map(decodeHTMLEntities),
            correct: correctIndex,
            category: q.category,
            difficulty: q.difficulty
          };
        });
        
        setQuestions(formattedQuestions);
        setError(null); // Clear any previous errors
      } else {
        throw new Error('No questions received from API');
      }
    } catch (err) {
      console.error('API failed, using sample questions:', err);
      
      // Using sample questions as fallback
      const filteredSamples = sampleQuestions.slice(0, config.amount);
      const shuffledSamples = filteredSamples.map(q => ({
        ...q,
        options: shuffle([...q.options]) // Creating a copy before shuffling
      }));
      
      setQuestions(shuffledSamples);
      setError('Using offline questions - API temporarily unavailable');
    }
    
    setLoading(false);
  };

  const decodeHTMLEntities = (text) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const handleAnswerSelect = (optionIndex) => {
    setCurrentSelection(optionIndex);
    // Save answer immediately
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizComplete = () => {
    const finalAnswers = { ...selectedAnswers };
    if (currentSelection !== null) {
      finalAnswers[currentQuestionIndex] = currentSelection;
    }

    let correctCount = 0;
    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    const results = {
      questions,
      selectedAnswers: finalAnswers,
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount * 100) / questions.length)
    };

    onComplete(results);
    navigate('/results');
  };

  const formatTime = (seconds) => {
    // Handle invalid or undefined seconds
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return '0h 0m 0s';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (loading) {
    return <LoadingSpinner message="Loading quiz questions..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-error">
        <h2>Unable to load questions</h2>
        <p>Please check your internet connection and try again.</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Back to Setup
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-game">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>The Ultimate Trivia Quiz</h1>
          <div className="quiz-stats">
            <span className="timer">Time: {formatTime(timeRemaining)}</span>
            <span className="question-counter">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.5)',
          borderRadius: '8px',
          padding: '10px',
          margin: '0 auto 20px',
          maxWidth: '800px',
          textAlign: 'center',
          color: '#856404'
        }}>
          {error}
        </div>
      )}

      <div className="quiz-content">
        <div className="question-container">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`option-button ${
                  currentSelection === index ? 'selected' : ''
                }`}
              >
                <span className="option-label">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          
          <button
            onClick={handleNextQuestion}
            className="btn-primary"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;