import React, { useState, useEffect } from 'react';
import './Quiz.css';
import quizData from './quiz.json';

function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Handle answer selection
  const handleAnswerSelection = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer
    });
    setTimerActive(false);

    document.activeElement.blur();  

    setTimeout(() => {
      nextQuestion();
      setTimerActive(true);
    }, 300);
  };

  // Start quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setTimerActive(true);
  };

  // Next question logic
  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10);
    } else {
      setShowResults(true);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      nextQuestion();
    }
  }, [timer, timerActive]);

  // Calculate score
  const calculateScore = () => {
    return quizData.reduce((score, question, index) => {
      return selectedAnswers[index] === question.answer ? score + 1 : score;
    }, 0);
  };

  // Restart quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimer(10);
    setTimerActive(true);
    setQuizStarted(false);
  };

  return (
    <>
      <h2 style={{transform: "translateY(-80px)" }}>Quiz</h2>
      <div className="quiz">
        {!quizStarted ? (
          <div className="start-screen">
            <h2>Welcome to the Quiz!</h2>
            <p>Test your knowledge with {quizData.length} questions</p>
            <button className="start-button" onClick={startQuiz}>Start Quiz</button>
          </div>
        ) : !showResults ? (
          <>
            <h2>{quizData[currentQuestionIndex].question}</h2>
            <div className="options">
              {['A', 'B', 'C', 'D'].map(option => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelection(option)}
                  className={selectedAnswers[currentQuestionIndex] === option ? 'selected' : ''}
                >
                  {quizData[currentQuestionIndex][option]}
                </button>
              ))}
            </div>
            <div className="timer">
              <p>Time left: {timer}s</p>
            </div>
          </>
        ) : (
          <div className="results">
            <h2>Your Score: {calculateScore()} / {quizData.length}</h2>
            <button onClick={restartQuiz}>Restart Quiz</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;
