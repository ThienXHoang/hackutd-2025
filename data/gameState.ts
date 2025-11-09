import { Category, Difficulty, Question, quiz, getRandomCategory } from './quiz';

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
  currentCategory: Category;
  currentDifficulty: Difficulty;
  currentQuestion: Question | null;

  selectedChoiceIndex: number | null;

  points: number;
  correctCountByDifficulty: Record<Difficulty, number>;
  masteryProgressByDifficulty: Record<Difficulty, number>; // 0.0–1.0

  usedQuestionIds: Set<string>;
  isAnswered: boolean;
  lastAnswerCorrect: boolean | null;

  gameOver: boolean;
}

// Initialize a new quiz session
export function createInitialQuizState(): QuizState {
  const startingCategory = getRandomCategory();
  const startingDifficulty = Difficulty.Easy;

  const state: QuizState = {
    currentCategory: startingCategory,
    currentDifficulty: startingDifficulty,
    currentQuestion: null,

    selectedChoiceIndex: null,

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

  // Immediately pick a first question
  loadNextQuestion(state);

  return state;
}

// Choose a new question given the state's category/difficulty
export function loadNextQuestion(state: QuizState): void {
  if (state.gameOver) {
    state.currentQuestion = null;
    return;
  }

  const category = state.currentCategory;
  const difficulty = state.currentDifficulty;

  // Grab all questions for this category + difficulty
  const questionMap = quiz.get(category)?.get(difficulty);
  
  if (!questionMap) {
    // No questions at this difficulty+category: pick a new random category and try again
    state.currentCategory = getRandomCategory();
    loadNextQuestion(state);
    return;
  }

  // Filter out already used questions
  const allQuestions = Array.from(questionMap.values());
  const availableQuestions = allQuestions.filter(
    (q) => !state.usedQuestionIds.has(q.id)
  );

  if (availableQuestions.length === 0) {
    // No more unused questions at this difficulty: change category or end
    state.currentCategory = getRandomCategory();
    loadNextQuestion(state);
    return;
  }

  // Random pick from available
  const randIndex = Math.floor(Math.random() * availableQuestions.length);
  const picked = availableQuestions[randIndex];

  state.currentQuestion = picked;
  state.usedQuestionIds.add(picked.id);

  // Reset per-question stuff
  state.selectedChoiceIndex = null;
  state.isAnswered = false;
  state.lastAnswerCorrect = null;
}

// User clicks on a choice option
export function selectChoice(state: QuizState, choiceIndex: number): void {
  if (state.gameOver) return;
  if (!state.currentQuestion) return;
  if (state.isAnswered) return; // Prevent changing after submit

  state.selectedChoiceIndex = choiceIndex;
}

// User hits "Submit"
export function submitAnswer(state: QuizState): boolean {
  if (state.gameOver) return false;
  if (!state.currentQuestion) return false;

  if (state.selectedChoiceIndex === null) {
    // UI should show "please select an answer" message
    return false;
  }

  if (state.isAnswered) {
    // Already submitted this question
    return false;
  }

  const question = state.currentQuestion;
  const chosen = question.choices[state.selectedChoiceIndex];
  const isCorrect = chosen.isCorrect === true;

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

// If mastery is complete, move to next difficulty
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

    // Optional: reset category too
    state.currentCategory = getRandomCategory();

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
