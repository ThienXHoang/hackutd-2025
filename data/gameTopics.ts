// data/gameTopics.ts

import { Category } from "./quiz";

// 6 player-facing topics
export enum GameTopic {
  Income = "income",
  Budgeting = "budgeting",
  Saving = "saving",
  Investing = "investing",
  DebtManagement = "debt_management",
  RiskManagement = "risk_management",
}

// Map each game topic to the underlying question categories
export const TopicToCategories: Record<GameTopic, Category[]> = {
  [GameTopic.Income]: [
    Category.Budgeting,
    Category.Saving,
    Category.Taxes,
    Category.Investing,
  ],
  [GameTopic.Budgeting]: [Category.Budgeting],
  [GameTopic.Saving]: [Category.Saving],
  [GameTopic.Investing]: [Category.Investing],
  [GameTopic.DebtManagement]: [Category.Debt, Category.Credit],
  [GameTopic.RiskManagement]: [Category.Insurance, Category.Fraud],
};

// Helper to display nice names
export function formatGameTopic(topic: GameTopic): string {
  switch (topic) {
    case GameTopic.Income: return "Income";
    case GameTopic.Budgeting: return "Budgeting";
    case GameTopic.Saving: return "Saving";
    case GameTopic.Investing: return "Investing";
    case GameTopic.DebtManagement: return "Debt Management";
    case GameTopic.RiskManagement: return "Risk Management";
  }
}