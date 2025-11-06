import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, initializeQuestions } from '../services/firestore';
import { UserStats } from '../types';
import { Play, LogOut, Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          // Initialize questions if they don't exist
          await initializeQuestions();
          
          // Load user stats
          const stats = await getUserStats(currentUser.uid);
          setUserStats(stats);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const startQuiz = () => {
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {currentUser?.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full border-4 border-violet-200"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back, {currentUser?.displayName?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Start Quiz Card */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white transform transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                <Play className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Ready for a Challenge?</h2>
              <p className="text-violet-100 mb-8 text-lg">
                Test your vocabulary with 5 randomly selected questions from our database of 20 words.
              </p>
              <button
                onClick={startQuiz}
                className="bg-white text-violet-600 font-bold py-4 px-8 rounded-xl hover:bg-violet-50 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Quiz Now
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Trophy className="w-7 h-7 text-violet-600 mr-3" />
              Your Progress
            </h2>
            
            {userStats ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
                  <div className="flex items-center">
                    <Target className="w-6 h-6 text-violet-600 mr-3" />
                    <span className="text-gray-700 font-medium">Total Quizzes</span>
                  </div>
                  <span className="text-2xl font-bold text-violet-600">{userStats.totalQuizzes}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                    <span className="text-gray-700 font-medium">Average Score</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{userStats.averageScore}%</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <Trophy className="w-6 h-6 text-green-600 mr-3" />
                    <span className="text-gray-700 font-medium">Best Score</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{userStats.bestScore}%</span>
                </div>

                {userStats.lastQuizDate && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <Calendar className="w-6 h-6 text-gray-600 mr-3" />
                      <span className="text-gray-700 font-medium">Last Quiz</span>
                    </div>
                    <span className="text-gray-600">
                      {new Date(userStats.lastQuizDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-violet-600" />
                </div>
                <p className="text-gray-600 text-lg">No quiz history yet!</p>
                <p className="text-gray-500">Take your first quiz to see your stats here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">20 Questions</h3>
            <p className="text-gray-600 text-sm">Curated vocabulary from our extensive database</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Progress Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor your improvement over time</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Instant Feedback</h3>
            <p className="text-gray-600 text-sm">Learn from detailed explanations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;