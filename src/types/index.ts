export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    userAnswer: number;
    correct: boolean;
  }[];
  completedAt: Date;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  lastQuizDate?: Date;
}