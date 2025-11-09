import { Category, Difficulty, Question, quiz } from './quiz';
import { GameTopic, TopicToCategories } from './gameTopics';

// Order matters for leveling up
export const DifficultyOrder = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];

// How many correct answers you need to "master" each difficulty
export const masteryThreshold: Record<Difficulty, number> = {
  [Difficulty.Easy]: 5,
  [Difficulty.Medium]: 5,
  [Difficulty.Hard]: 9999, // Final tier - effectively infinite
};

// Core state for the quiz session
export interface QuizState {
  // NEW: locked-in topic for this run
  selectedTopic: GameTopic;
  // NEW: list of underlying categories allowed for this topic
  allowedCategories: Category[];

  currentCategory: Category;
  currentDifficulty: Difficulty;
  currentQuestion: Question | null;

  selectedAnswer: string | number | null;

  points: number;
  correctCountByDifficulty: Record<Difficulty, number>;
  masteryProgressByDifficulty: Record<Difficulty, number>; // 0.0–1.0

  usedQuestionIds: Set<string>;
  isAnswered: boolean;
  lastAnswerCorrect: boolean | null;

  gameOver: boolean;
}

// Helper to pick random category from allowed list
function getRandomAllowedCategory(allowed: Category[]): Category {
  const idx = Math.floor(Math.random() * allowed.length);
  return allowed[idx];
}

// NEW: Initialize a new quiz session with a chosen topic
export function createQuizStateForTopic(topic: GameTopic): QuizState {
  const allowedCategories = TopicToCategories[topic];

  // pick a starting category from allowed list
  const startingCategory = getRandomAllowedCategory(allowedCategories);
  const startingDifficulty = Difficulty.Easy;

  const state: QuizState = {
    selectedTopic: topic,
    allowedCategories,

    currentCategory: startingCategory,
    currentDifficulty: startingDifficulty,
    currentQuestion: null,

    selectedAnswer: null,
    points: 0,
    correctCountByDifficulty: {
      [Difficulty.Easy]: 0,
      [Difficulty.Medium]: 0,
      [Difficulty.Hard]: 0,
    },
    masteryProgressByDifficulty: {
      [Difficulty.Easy]: 0,
      [Difficulty.Medium]: 0,
      [Difficulty.Hard]: 0,
    },
    usedQuestionIds: new Set<string>(),
    isAnswered: false,
    lastAnswerCorrect: null,
    gameOver: false,
  };

  loadNextQuestion(state); // reuse existing function
  return state;
}

// OLD: Keep for backwards compatibility if needed
export function createInitialQuizState(): QuizState {
  // Default to Income topic if not using topic selection
  return createQuizStateForTopic(GameTopic.Income);
}

// UPDATED: Choose a new question given the state's category/difficulty
export function loadNextQuestion(state: QuizState): void {
  if (state.gameOver) {
    state.currentQuestion = null;
    return;
  }

  let category = state.currentCategory;
  const difficulty = state.currentDifficulty;

  // Try to get questions for current category + difficulty
  let questionMap = quiz.get(category)?.get(difficulty);

  // If no questions for this category at this difficulty, rotate to another allowed category
  if (!questionMap) {
    category = getRandomAllowedCategory(state.allowedCategories);
    state.currentCategory = category;
    questionMap = quiz.get(category)?.get(difficulty);
  }

  if (!questionMap) {
    // If still nothing, we can bail or mark gameOver.
    state.gameOver = true;
    state.currentQuestion = null;
    return;
  }

  // Filter out already used questions within allowed categories
  const allQuestions = Array.from(questionMap.values());
  const availableQuestions = allQuestions.filter(
    (q) => !state.usedQuestionIds.has(q.id)
  );

  if (availableQuestions.length === 0) {
    // No unused questions for this category + difficulty -> try another allowed category
    const otherCategories = state.allowedCategories.filter(
      (c) => c !== category
    );

    if (otherCategories.length === 0) {
      state.gameOver = true;
      state.currentQuestion = null;
      return;
    }

    const nextCategory = getRandomAllowedCategory(otherCategories);
    state.currentCategory = nextCategory;

    const nextMap = quiz.get(nextCategory)?.get(difficulty);
    if (!nextMap) {
      state.gameOver = true;
      state.currentQuestion = null;
      return;
    }

    const nextAll = Array.from(nextMap.values());
    const nextAvailable = nextAll.filter(
      (q) => !state.usedQuestionIds.has(q.id)
    );

    if (nextAvailable.length === 0) {
      state.gameOver = true;
      state.currentQuestion = null;
      return;
    }

    const randIdx = Math.floor(Math.random() * nextAvailable.length);
    const picked = nextAvailable[randIdx];

    state.currentQuestion = picked;
    state.usedQuestionIds.add(picked.id);
  } else {
    // Normal path: we have available questions in this category
    const randIdx = Math.floor(Math.random() * availableQuestions.length);
    const picked = availableQuestions[randIdx];

    state.currentQuestion = picked;
    state.usedQuestionIds.add(picked.id);
  }

  state.selectedAnswer = null;
  state.isAnswered = false;
  state.lastAnswerCorrect = null;
}

// User clicks on a choice option
export function selectAnswer(state: QuizState, answer: string | number): void {
  if (state.gameOver) return;
  if (!state.currentQuestion) return;
  if (state.isAnswered) return; // Prevent changing after submit

  state.selectedAnswer = answer;
}

// User hits "Submit"
export function submitAnswer(state: QuizState): boolean {
  if (state.gameOver) return false;
  if (!state.currentQuestion) return false;

  if (state.selectedAnswer === null) {
    // UI should show "please select an answer" message
    return false;
  }

  if (state.isAnswered) {
    // Already submitted this question
    return false;
  }

  const question = state.currentQuestion;
  let isCorrect = false;

  switch (question.type) {
    case 'mc':
      const chosenIndex = state.selectedAnswer as number;
      isCorrect = question.choices[chosenIndex].isCorrect === true;
      break;
    case 'fb':
      const userAnswer = (state.selectedAnswer as string).trim().toLowerCase();
      isCorrect = userAnswer === question.answer.toLowerCase();
      break;
    case 'tf':
      const userIsTrue = state.selectedAnswer === 1;
      isCorrect = userIsTrue === question.isTrue;
      break;
  }

  state.isAnswered = true;
  state.lastAnswerCorrect = isCorrect;

  // Update score & mastery
  updatePointsAndMastery(state, isCorrect);
  
  return true;
}

// Scoring + mastery progression logic
function updatePointsAndMastery(state: QuizState, isCorrect: boolean): void {
  const difficulty = state.currentDifficulty;

  if (isCorrect) {
    // Dynamic point values per difficulty
    const basePoints =
      difficulty === Difficulty.Easy
        ? 10
        : difficulty === Difficulty.Medium
        ? 20
        : 30;

    state.points += basePoints;
    state.correctCountByDifficulty[difficulty] += 1;
  }

  // Recompute mastery for this difficulty (0..1)
  const correctCount = state.correctCountByDifficulty[difficulty];
  const needed = masteryThreshold[difficulty];
  const progress = Math.min(correctCount / needed, 1);

  state.masteryProgressByDifficulty[difficulty] = progress;

  // Check if we level up to the next difficulty
  checkDifficultyLevelUp(state);
}

// UPDATED: If mastery is complete, move to next difficulty
function checkDifficultyLevelUp(state: QuizState): void {
  const currentIndex = DifficultyOrder.indexOf(state.currentDifficulty);
  const difficulty = state.currentDifficulty;

  const progress = state.masteryProgressByDifficulty[difficulty];
  const mastered = progress >= 1;

  if (!mastered) return;

  // If there *is* a higher difficulty, promote
  if (currentIndex + 1 < DifficultyOrder.length) {
    const nextDifficulty = DifficultyOrder[currentIndex + 1];

    state.currentDifficulty = nextDifficulty;

    // Stay within allowed categories
    state.currentCategory = getRandomAllowedCategory(state.allowedCategories);

    // Note: correctCountByDifficulty keeps history
    // masteryProgressByDifficulty[nextDifficulty] starts at 0 anyway
  } else {
    // Already at highest difficulty and mastered → mark game as done
    state.gameOver = true;
  }
}

// When user hits "Next" after seeing feedback
export function goToNextQuestion(state: QuizState): void {
  if (state.gameOver) {
    // You can show "spell complete" screen instead of question
    return;
  }

  loadNextQuestion(state);
  state.selectedAnswer = null;
}

// For a points bar (0–100%)
export function getPointsBarPercent(state: QuizState): number {
  const softMaxPoints = 200; // Just for UI scaling
  const clamped = Math.min(state.points, softMaxPoints);
  return (clamped / softMaxPoints) * 100;
}

// Mastery bar for current difficulty (0–100%)
export function getCurrentMasteryPercent(state: QuizState): number {
  const difficulty = state.currentDifficulty;
  const progress = state.masteryProgressByDifficulty[difficulty] || 0;
  return progress * 100;
}

// Helper to get current mastery count info
export function getCurrentMasteryInfo(state: QuizState): {
  current: number;
  needed: number;
  difficulty: Difficulty;
} {
  const difficulty = state.currentDifficulty;
  return {
    current: state.correctCountByDifficulty[difficulty],
    needed: masteryThreshold[difficulty],
    difficulty,
  };
}

// Helper to format difficulty name for display
export function formatDifficulty(difficulty: Difficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

// Helper to format category name for display
export function formatCategory(category: Category): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}