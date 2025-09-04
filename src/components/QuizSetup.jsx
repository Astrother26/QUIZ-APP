import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizSetup = ({ onQuizStart }) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    category: '',
    amount: 5,
    difficulty: 'easy',
    type: 'multiple',
    timer: { minutes: 2, seconds: 0 }

  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://opentdb.com/api_category.php');
      const data = await response.json();
      setCategories(data.trivia_categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimerChange = (unit, value) => {
    setConfig(prev => ({
      ...prev,
      timer: {
        ...prev.timer,
        [unit]: parseInt(value) || 0
      }
    }));
  };

  const handleStartQuiz = () => {
    onQuizStart(config);
    navigate('/quiz');
  };

  const questionAmounts = [5, 6, 7, 8, 9, 10];
  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];
  const questionTypes = [
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'boolean', label: 'True / False' }
  ];

  return (
    <div className="quiz-setup">
      <div className="quiz-setup-container">
        <div className="quiz-header">
          <div className="quiz-logo">
            <div className="quiz-logo">
              <h1 className="quiz-title">🧠 The Ultimate Trivia Quiz</h1>
            </div>
          </div>
        </div>

        <div className="quiz-form">
          <div className="form-group">
            <label htmlFor="category">In which category do you want to play the quiz?</label>
            <select 
              id="category"
              value={config.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="">Any Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">How many questions do you want in your quiz?</label>
            <select 
              id="amount"
              value={config.amount}
              onChange={(e) => handleInputChange('amount', parseInt(e.target.value))}
              className="form-select"
            >
              {questionAmounts.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">How difficult do you want your quiz to be?</label>
            <select 
              id="difficulty"
              value={config.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value)}
              className="form-select"
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>{diff.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Which type of questions do you want in your quiz?</label>
            <select 
              id="type"
              value={config.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="form-select"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Please select the countdown time for your quiz.</label>
            <div className="timer-inputs">
              <div className="timer-input">
                <select 
                  value={config.timer.hours}
                  onChange={(e) => handleTimerChange('hours', e.target.value)}
                  className="form-select timer-select"
                >
              
                  {Array.from({length: 60}, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <span className="timer-label">Minutes</span>
              </div>
              <div className="timer-input">
                <select 
                  value={config.timer.seconds}
                  onChange={(e) => handleTimerChange('seconds', e.target.value)}
                  className="form-select timer-select"
                >
                  {Array.from({length: 60}, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <span className="timer-label">Seconds</span>
              </div>
            </div>
          </div>

          <button 
            className="play-button"
            onClick={handleStartQuiz}
            disabled={loading}
          >
            <span className="play-icon">▶</span>
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;