import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRandomQuestions, saveQuizResult, initializeQuestions } from '../services/firestore';
import { Question, QuizResult } from '../types';
import { ArrowLeft, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';

const Quiz: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            handleTimeout();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showResult]);

  const loadQuestions = async () => {
    try {
      // Ensure questions exist in Firestore before fetching
      await initializeQuestions();
      const quizQuestions = await getRandomQuestions(5);
      setQuestions(quizQuestions);
      setSelectedAnswers(new Array(5).fill(-1));
      setTimerActive(true);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeout = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      finishQuiz();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowFeedback(true);
    setTimerActive(false);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setCurrentQuestionIndex(prev => prev + 1);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const finishQuiz = async () => {
    setTimerActive(false);
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correct_answer
    ).length;

    const score = Math.round((correctAnswers / questions.length) * 100);
    
    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      answers: selectedAnswers.map((answer, index) => ({
        questionId: questions[index].id,
        userAnswer: answer,
        correct: answer === questions[index].correct_answer
      })),
      completedAt: new Date()
    };

    setQuizResult(result);
    setShowResult(true);

    if (currentUser) {
      try {
        await saveQuizResult(currentUser.uid, result);
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(5).fill(-1));
    setShowResult(false);
    setQuizResult(null);
    setShowFeedback(false);
    setTimeLeft(30);
    loadQuestions();
  };

  const goHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-violet-600 text-lg">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (showResult && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                quizResult.score >= 80 ? 'bg-green-100' : quizResult.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {quizResult.score >= 80 ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
              <p className="text-xl text-gray-600">
                Your Score: <span className="font-bold text-violet-600">{quizResult.score}%</span>
              </p>
              <p className="text-gray-500">
                {quizResult.answers.filter(a => a.correct).length} out of {quizResult.totalQuestions} correct
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800">Question Review</h2>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correct_answer;
                
                return (
                  <div key={question.id} className={`p-6 rounded-xl border-2 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-800 flex-1">
                        {index + 1}. {question.question}
                      </h3>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 ml-2" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 ml-2" />
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={`p-3 rounded-lg ${
                          optionIndex === question.correct_answer ? 'bg-green-100 border border-green-300' :
                          optionIndex === userAnswer && !isCorrect ? 'bg-red-100 border border-red-300' :
                          'bg-white border border-gray-200'
                        }`}>
                          {option}
                          {optionIndex === question.correct_answer && (
                            <span className="text-green-600 font-semibold ml-2">✓ Correct</span>
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <span className="text-red-600 font-semibold ml-2">✗ Your answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={retakeQuiz}
                className="flex items-center px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </button>
              <button
                onClick={goHome}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goHome}
            className="flex items-center text-gray-600 hover:text-violet-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full shadow-md ${
              timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600'
            }`}>
              <Clock className="w-4 h-4 mr-2" />
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-full shadow-lg mb-8 p-1">
          <div
            className="bg-gradient-to-r from-violet-600 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion?.question}</h2>
          
          <div className="space-y-4">
            {currentQuestion?.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-105";
              
              if (showFeedback) {
                if (index === currentQuestion.correct_answer) {
                  buttonClass += " border-green-500 bg-green-100 text-green-800";
                } else if (index === selectedAnswers[currentQuestionIndex] && index !== currentQuestion.correct_answer) {
                  buttonClass += " border-red-500 bg-red-100 text-red-800";
                } else {
                  buttonClass += " border-gray-200 bg-gray-50 text-gray-600";
                }
              } else if (selectedAnswers[currentQuestionIndex] === index) {
                buttonClass += " border-violet-500 bg-violet-100 text-violet-800";
              } else {
                buttonClass += " border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showFeedback}
                  className={buttonClass}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <p className="text-gray-700">
                <strong>Explanation:</strong> {currentQuestion?.explanation}
              </p>
              <div className="mt-4 flex justify-center">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={finishQuiz}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Finish Quiz
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
