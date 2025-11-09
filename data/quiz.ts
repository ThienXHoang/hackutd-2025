// data/quiz.ts
import multipleChoiceData from './questions.json';
import trueFalseData from './questionsTF.json';
import dropdownData from './questionsDropdown.json';
import fillInData from './questionsFB.json';
import { GameTopic } from './gameTopics';

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  TrueFalse = 'true-false',
  FillInTheBlank = 'fill-in-the-blank',
  Dropdown = 'dropdown',
}

export type Difficulty = 'easy' | 'medium' | 'hard';

// Exported Choice type so components can import it
export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  id: string; // Add this line
  type: QuestionType.MultipleChoice;
  category: string;
  difficulty: string;
  question: string;
  choices: Choice[];
}

export interface TrueFalseQuestion {
  id: string; // Add this line
  type: QuestionType.TrueFalse;
  category: string;
  difficulty: string;
  statement: string;
  isTrue: boolean;
}

export interface FillInTheBlankQuestion {
  id: string; // Add this line
  type: QuestionType.FillInTheBlank;
  category: string;
  difficulty: string;
  question: string;
  correctAnswer: string;
}

export interface DropdownQuestion {
  id: string; // Add this line
  type: QuestionType.Dropdown;
  category: string;
  difficulty: string;
  question: string;
  blanks: {
    correctAnswer: string;
    options: string[];
  }[];
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillInTheBlankQuestion
  | DropdownQuestion;

// Convert multiple choice data
const multipleChoiceQuestions: MultipleChoiceQuestion[] = multipleChoiceData.map((q: any, index) => ({
  id: `mc-${index}`,
  type: QuestionType.MultipleChoice,
  category: q.category,
  difficulty: q.difficulty,
  question: q.question,
  choices: q.choices,
}));

// Convert true/false data
const trueFalseQuestions: TrueFalseQuestion[] = trueFalseData.map((q: any, index) => ({
  id: `tf-${index}`,
  type: QuestionType.TrueFalse,
  category: q.category,
  difficulty: q.difficulty,
  statement: q.statement,
  isTrue: q.isTrue,
}));

// Convert dropdown data
const dropdownQuestions: DropdownQuestion[] = dropdownData.map((q: any, index) => ({
  id: `dd-${index}`,
  type: QuestionType.Dropdown,
  category: q.category,
  difficulty: q.difficulty,
  question: q.question,
  blanks: q.blanks || [],
}));

// Convert fill-in-the-blank data (FRQ style)
const fillInQuestions: FillInTheBlankQuestion[] = fillInData.map((q: any, index) => ({
  id: `fb-${index}`,
  type: QuestionType.FillInTheBlank,
  category: q.category,
  difficulty: q.difficulty,
  question: q.question,
  correctAnswer: q.answer,
}));

export const allQuestions: Question[] = [
  ...multipleChoiceQuestions,
  ...trueFalseQuestions,
  ...dropdownQuestions,
  ...fillInQuestions,
];

// Topic to category mapping
function questionMatchesTopic(q: Question, topic: GameTopic): boolean {
  const category = q.category.toLowerCase();
  
  switch (topic) {
    case GameTopic.Income:
      return category === 'income' || category === 'banking' || category === 'taxes';
    
    case GameTopic.Budgeting:
      return category === 'budgeting';
    
    case GameTopic.Saving:
      return category === 'saving';
    
    case GameTopic.Investing:
      return category === 'investing';
    
    case GameTopic.DebtManagement:
      return category === 'debt management' || category === 'debt' || category === 'credit';
    
    case GameTopic.RiskManagement:
      return category === 'risk management' || category === 'insurance' || category === 'fraud';
    
    default:
      return false;
  }
}

// Add a Set to store answered question IDs
const answeredQuestions = new Set<string>();

// Add function to mark questions as answered
export function markQuestionAsAnswered(questionId: string) {
  answeredQuestions.add(questionId);
}

// Get random question for a topic and difficulty with type filtering
export function getRandomQuestionForTopic(
  topic: GameTopic,
  difficulty: Difficulty
): Question | null {
  // Filter by topic, difficulty, and unanswered status
  const byTopicAndDifficulty = allQuestions.filter((q) => {
    const matchesTopic = questionMatchesTopic(q, topic);
    const matchesDifficulty = q.difficulty.toLowerCase() === difficulty.toLowerCase();
    const isUnanswered = !answeredQuestions.has(q.id);
    return matchesTopic && matchesDifficulty && isUnanswered;
  });

  // Determine allowed types based on difficulty
  let allowedTypes: QuestionType[];
  if (difficulty === 'hard') {
    // HARD: use FRQ fill-in + MC + TF, but NO dropdown
    allowedTypes = [
      QuestionType.FillInTheBlank,
      QuestionType.MultipleChoice,
      QuestionType.TrueFalse,
    ];
  } else {
    // EASY / MEDIUM: allow MC + TF + Dropdown, skip FRQ
    allowedTypes = [
      QuestionType.MultipleChoice,
      QuestionType.TrueFalse,
      QuestionType.Dropdown,
    ];
  }

  // Group questions by allowed types
  const questionsByType: Record<QuestionType, Question[]> = {} as any;
  allowedTypes.forEach((type) => {
    questionsByType[type] = byTopicAndDifficulty.filter((q) => q.type === type);
  });

  // Filter out types with no questions
  const availableTypes = allowedTypes.filter((type) => questionsByType[type].length > 0);

  if (availableTypes.length === 0) {
    console.warn(`No questions found for topic: ${topic}, difficulty: ${difficulty}`);
    return null;
  }

  // Randomly pick a type from available types
  const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  const questionsOfType = questionsByType[randomType];

  // Randomly pick a question from the selected type
  const randomIndex = Math.floor(Math.random() * questionsOfType.length);
  return questionsOfType[randomIndex];
}

// Legacy function for backward compatibility (if needed elsewhere)
export function getRandomQuestion(category: string, difficulty: string): Question | null {
  const filtered = allQuestions.filter(
    (q) => q.category === category && q.difficulty.toLowerCase() === difficulty.toLowerCase()
  );

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

// Add function to reset answered questions (useful for new games)
export function resetAnsweredQuestions() {
  answeredQuestions.clear();
}
