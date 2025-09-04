import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuizSetup from "./components/QuizSetup.jsx";
import QuizGame from "./components/QuizGame.jsx";
import ResultsPage from "./components/ResultsPage.jsx";


function App() {
  const [quizConfig, setQuizConfig] = useState({
    category: '',
    amount: 5,
    difficulty: 'easy',
    type: 'multiple',
    timer: { hours: 0, minutes: 2, seconds: 0 }
  });
  
  const [quizResults, setQuizResults] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);

  const handleQuizStart = (config) => {
    setQuizConfig(config);
    setQuizStartTime(Date.now());
  };

  const handleQuizComplete = (results) => {
    const endTime = Date.now();
    const totalTime = endTime - quizStartTime;
    setQuizResults({
      ...results,
      totalTime,
      config: quizConfig
    });
  };

  const handleRestart = () => {
    setQuizResults(null);
    setQuizStartTime(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<QuizSetup onQuizStart={handleQuizStart} />} 
          />
          <Route 
            path="/quiz" 
            element={
              quizStartTime ? (
                <QuizGame 
                  config={quizConfig} 
                  onComplete={handleQuizComplete} 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/results" 
            element={
              quizResults ? (
                <ResultsPage 
                  results={quizResults} 
                  onRestart={handleRestart} 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;