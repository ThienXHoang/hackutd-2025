import questions from "./questions.json";

export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export enum Category {
  Budgeting = "budgeting",
  Saving = "saving",
  Banking = "banking",
  Credit = "credit",
  Debt = "debt",
  Investing = "investing",
  Retirement = "retirement",
  Taxes = "taxes",
  Insurance = "insurance",
  Fraud = "fraud",
}

export interface Choice {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  category: Category;
  difficulty: Difficulty;
  id: string;
  question: string;
  choices: Choice[];
}

export type QuestionDict = Map<
  Category,
  Map<Difficulty, Map<string, Question>>
>;

export const quiz: QuestionDict = (() => {
  let dict: QuestionDict = new Map();

  questions.forEach((q) => {
    const question = q as Question;
    const category = question.category as Category;
    const difficulty = question.difficulty as Difficulty;
    const id = question.id;

    if (!dict.has(category)) {
      dict.set(category, new Map([[difficulty, new Map([[id, question]])]]));
    }

    dict.get(category)?.get(difficulty)?.set(id, question);
  });

  return dict;
})();

export function getRandomCategory() {
  const categories = Object.values(Category);

  const randIndex = Math.floor(Math.random() * categories.length);

  return categories[randIndex];
}

export function getRandomQuestion(category: Category, difficulty: Difficulty) {
  let questionMap = quiz.get(category)?.get(difficulty);
  if (!questionMap) return null;
  let questions = Array.from(questionMap.values());

  console.log(questions);
  let rand = Math.floor(Math.random() * questions.length);
  return questions[rand];
}
