import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateGrade } from '../utils';
import { timeConverter } from '../utils';

const ResultsPage = ({ results, onRestart }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  
  const gradeInfo = calculateGrade(results.percentage);
  const timeInfo = timeConverter(results.totalTime);
  
  const handlePlayAgain = () => {
    onRestart();
    navigate('/');
  };

  const handleBackToHome = () => {
    onRestart();
    navigate('/');
  };

  const formatTime = (timeObj) => {
    if (!timeObj) return '0h 0m 0s';
    return `${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s`;
  };

  const getPassingScore = () => 60;

  return (
    <div className="results-page">
      <div className="results-container">
        <div className="results-header">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
            <button 
              className={`tab-button ${activeTab === 'qna' ? 'active' : ''}`}
              onClick={() => setActiveTab('qna')}
            >
              QNA
            </button>
          </div>
        </div>

        {activeTab === 'stats' && (
          <div className="stats-content">
            <div className="motivational-message">
              {gradeInfo?.remarks || "Great effort on completing the quiz!"}
            </div>

            <div className="grade-display">
              Grade: {gradeInfo?.grade || 'N/A'}
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Questions:</div>
                <div className="stat-value">{results.total}</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Correct Answers:</div>
                <div className="stat-value">{results.correct}</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Your Score:</div>
                <div className="stat-value">{results.percentage}%</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Passing Score:</div>
                <div className="stat-value">{getPassingScore()}%</div>
              </div>

              <div className="stat-item">
                <div className="stat-label">Time Taken:</div>
                <div className="stat-value">{formatTime(timeInfo)}</div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-play-again" onClick={handlePlayAgain}>
                <span className="btn-icon"></span>
                Play Again
              </button>
              
              <button className="btn-home" onClick={handleBackToHome}>
                <span className="btn-icon"></span>
                Back to Home
              </button>
            </div>
          </div>
        )}

        {activeTab === 'qna' && (
          <div className="qna-content">
            <h2 className="qna-title">Question & Answer Review</h2>
            
            <div className="questions-review">
              {results.questions.map((question, index) => {
                const userAnswer = results.selectedAnswers[index];
                const isCorrect = userAnswer === question.correct;
                const wasAnswered = userAnswer !== undefined;

                return (
                  <div key={index} className="question-review">
                    <div className="question-header">
                      <span className={`question-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="question-number">Question {index + 1}</span>
                    </div>
                    
                    <div className="question-content">
                      <h3 className="question-text">{question.question}</h3>
                      
                      <div className="answer-details">
                        {wasAnswered ? (
                          <div className={`user-answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                            <strong>Your Answer:</strong> {String.fromCharCode(65 + userAnswer)}. {question.options[userAnswer]}
                          </div>
                        ) : (
                          <div className="user-answer not-answered">
                            <strong>Your Answer:</strong> Not answered
                          </div>
                        )}
                        
                        {!isCorrect && (
                          <div className="correct-answer">
                            <strong>Correct Answer:</strong> {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;