import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Question, QuizResult, UserStats } from '../types';

// Initialize vocabulary questions in Firestore
export const initializeQuestions = async () => {
  const questionsRef = collection(db, 'questions');
  const snapshot = await getDocs(questionsRef);
  
  if (snapshot.empty) {
    const vocabularyQuestions: Omit<Question, 'id'>[] = [
      {
        question: "What does 'ubiquitous' mean?",
        options: ["Rare and uncommon", "Present everywhere", "Ancient and old", "Difficult to understand"],
        correct_answer: 1,
        explanation: "Ubiquitous means existing or being everywhere at the same time; omnipresent."
      },
      {
        question: "What does 'ephemeral' mean?",
        options: ["Lasting forever", "Very expensive", "Lasting for a short time", "Extremely large"],
        correct_answer: 2,
        explanation: "Ephemeral means lasting for a very short time; transitory."
      },
      {
        question: "What does 'meticulous' mean?",
        options: ["Careless", "Very careful and precise", "Quickly done", "Confusing"],
        correct_answer: 1,
        explanation: "Meticulous means showing great attention to detail; very careful and precise."
      },
      {
        question: "What does 'gregarious' mean?",
        options: ["Antisocial", "Fond of company", "Angry and hostile", "Extremely quiet"],
        correct_answer: 1,
        explanation: "Gregarious means fond of the company of others; sociable."
      },
      {
        question: "What does 'pragmatic' mean?",
        options: ["Idealistic", "Practical and realistic", "Emotional", "Theoretical"],
        correct_answer: 1,
        explanation: "Pragmatic means dealing with things sensibly and realistically in a practical way."
      },
      {
        question: "What does 'eloquent' mean?",
        options: ["Silent", "Fluent and persuasive", "Confused", "Angry"],
        correct_answer: 1,
        explanation: "Eloquent means fluent or persuasive in speaking or writing."
      },
      {
        question: "What does 'redundant' mean?",
        options: ["Essential", "Not needed; superfluous", "Very important", "Complicated"],
        correct_answer: 1,
        explanation: "Redundant means not or no longer needed or useful; superfluous."
      },
      {
        question: "What does 'aesthetic' mean?",
        options: ["Ugly", "Related to beauty", "Mathematical", "Political"],
        correct_answer: 1,
        explanation: "Aesthetic means concerned with beauty or the appreciation of beauty."
      },
      {
        question: "What does 'ambiguous' mean?",
        options: ["Very clear", "Open to multiple interpretations", "Extremely simple", "Completely false"],
        correct_answer: 1,
        explanation: "Ambiguous means open to more than one interpretation; having a double meaning."
      },
      {
        question: "What does 'candid' mean?",
        options: ["Dishonest", "Truthful and straightforward", "Secretive", "Complicated"],
        correct_answer: 1,
        explanation: "Candid means truthful and straightforward; frank and honest."
      },
      {
        question: "What does 'diligent' mean?",
        options: ["Lazy", "Hardworking and careful", "Careless", "Inactive"],
        correct_answer: 1,
        explanation: "Diligent means having or showing care and conscientiousness in one's work or duties."
      },
      {
        question: "What does 'empathy' mean?",
        options: ["Hatred", "Understanding others' feelings", "Selfishness", "Confusion"],
        correct_answer: 1,
        explanation: "Empathy means the ability to understand and share the feelings of another."
      },
      {
        question: "What does 'facilitate' mean?",
        options: ["To hinder", "To make easier", "To complicate", "To destroy"],
        correct_answer: 1,
        explanation: "Facilitate means to make an action or process easier or help achieve."
      },
      {
        question: "What does 'hierarchy' mean?",
        options: ["Equality", "A system of ranking", "Chaos", "Freedom"],
        correct_answer: 1,
        explanation: "Hierarchy means a system in which members are ranked according to status or authority."
      },
      {
        question: "What does 'inevitable' mean?",
        options: ["Avoidable", "Certain to happen", "Unlikely", "Optional"],
        correct_answer: 1,
        explanation: "Inevitable means certain to happen; unavoidable."
      },
      {
        question: "What does 'juxtapose' mean?",
        options: ["To separate", "To place side by side", "To hide", "To destroy"],
        correct_answer: 1,
        explanation: "Juxtapose means to place or deal with close together for contrasting effect."
      },
      {
        question: "What does 'lucid' mean?",
        options: ["Confusing", "Clear and easy to understand", "Dark", "Complicated"],
        correct_answer: 1,
        explanation: "Lucid means expressed clearly; easy to understand."
      },
      {
        question: "What does 'mitigate' mean?",
        options: ["To worsen", "To make less severe", "To ignore", "To celebrate"],
        correct_answer: 1,
        explanation: "Mitigate means to make less severe, serious, or painful."
      },
      {
        question: "What does 'nostalgia' mean?",
        options: ["Future planning", "Sentimental longing for the past", "Present focus", "Fear of change"],
        correct_answer: 1,
        explanation: "Nostalgia means a sentimental longing or wistful affection for a past period."
      },
      {
        question: "What does 'optimize' mean?",
        options: ["To worsen", "To make the best use of", "To ignore", "To complicate"],
        correct_answer: 1,
        explanation: "Optimize means to make the best or most effective use of a situation or resource."
      }
    ];

    // Add each question to Firestore
    for (const question of vocabularyQuestions) {
      await addDoc(questionsRef, question);
    }
    
    console.log('Questions initialized in Firestore');
  }
};

export const getRandomQuestions = async (count: number = 5): Promise<Question[]> => {
  const questionsRef = collection(db, 'questions');
  const snapshot = await getDocs(questionsRef);
  
  const allQuestions: Question[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Question));

  // Shuffle array and return first 'count' questions
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const saveQuizResult = async (userId: string, result: QuizResult): Promise<void> => {
  const userResultsRef = collection(db, 'users', userId, 'results');
  await addDoc(userResultsRef, {
    ...result,
    completedAt: new Date()
  });

  // Update user stats
  await updateUserStats(userId, result);
};

const updateUserStats = async (userId: string, result: QuizResult): Promise<void> => {
  const userStatsRef = doc(db, 'userStats', userId);
  const userStatsDoc = await getDoc(userStatsRef);

  if (userStatsDoc.exists()) {
    const currentStats = userStatsDoc.data() as UserStats;
    const newTotalQuizzes = currentStats.totalQuizzes + 1;
    const newAverageScore = ((currentStats.averageScore * currentStats.totalQuizzes) + result.score) / newTotalQuizzes;
    const newBestScore = Math.max(currentStats.bestScore, result.score);

    await updateDoc(userStatsRef, {
      totalQuizzes: newTotalQuizzes,
      averageScore: Math.round(newAverageScore * 100) / 100,
      bestScore: newBestScore,
      lastQuizDate: new Date()
    });
  } else {
    await setDoc(userStatsRef, {
      userId,
      totalQuizzes: 1,
      averageScore: result.score,
      bestScore: result.score,
      lastQuizDate: new Date()
    });
  }
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  const userStatsRef = doc(db, 'userStats', userId);
  const userStatsDoc = await getDoc(userStatsRef);

  if (userStatsDoc.exists()) {
    return userStatsDoc.data() as UserStats;
  }

  return null;
};
