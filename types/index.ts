export interface FoodItem {
  id: string;
  name: string;
  caloriesPerServing: number;
  servingSize: string;
  category: "food" | "drink" | "snack";
  isFavorite: boolean;
  createdAt: Date;
}

export interface FoodEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  totalCalories: number;
  timestamp: Date;
  notes?: string;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number; // from Apple Health
  netCalories: number;
}

export interface UserSettings {
  dailyCalorieGoal: number;
  healthKitEnabled: boolean;
  notifications: boolean;
  theme: "light" | "dark" | "system";
}

export interface HealthData {
  activeEnergyBurned: number;
  basalEnergyBurned?: number;
  lastUpdated: Date;
}

export const STORAGE_KEYS = {
  FOOD_DATABASE: "@caloriepad/food_database",
  DAILY_ENTRIES: "@caloriepad/entries_", // + date
  FAVORITES: "@caloriepad/favorites",
  USER_SETTINGS: "@caloriepad/settings",
  HEALTH_CACHE: "@caloriepad/health_cache",
} as const;
