import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { StorageService } from "../services/storage";
import {
  DayData,
  FoodEntry,
  FoodItem,
  HealthData,
  UserSettings,
} from "../types";

// State interface
interface AppState {
  // Today's data
  todayEntries: FoodEntry[];
  todayCaloriesConsumed: number;
  todayCaloriesBurned: number;

  // Favorites
  favorites: FoodItem[];

  // Settings
  settings: UserSettings;

  // Health data
  healthData: HealthData | null;

  // UI state
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_FOOD_ENTRY"; payload: FoodEntry }
  | { type: "SET_TODAY_ENTRIES"; payload: FoodEntry[] }
  | { type: "SET_FAVORITES"; payload: FoodItem[] }
  | { type: "ADD_FAVORITE"; payload: FoodItem }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "SET_SETTINGS"; payload: UserSettings }
  | { type: "SET_HEALTH_DATA"; payload: HealthData | null }
  | { type: "UPDATE_CALORIES_CONSUMED"; payload: number }
  | { type: "UPDATE_CALORIES_BURNED"; payload: number };

// Initial state
const initialState: AppState = {
  todayEntries: [],
  todayCaloriesConsumed: 0,
  todayCaloriesBurned: 0,
  favorites: [],
  settings: {
    dailyCalorieGoal: 2000,
    healthKitEnabled: false,
    notifications: true,
    theme: "system",
  },
  healthData: null,
  loading: true,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "ADD_FOOD_ENTRY":
      const newEntries = [...state.todayEntries, action.payload];
      const newCaloriesConsumed = newEntries.reduce(
        (sum, entry) => sum + entry.totalCalories,
        0
      );
      return {
        ...state,
        todayEntries: newEntries,
        todayCaloriesConsumed: newCaloriesConsumed,
      };

    case "SET_TODAY_ENTRIES":
      const caloriesConsumed = action.payload.reduce(
        (sum, entry) => sum + entry.totalCalories,
        0
      );
      return {
        ...state,
        todayEntries: action.payload,
        todayCaloriesConsumed: caloriesConsumed,
      };

    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };

    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      };

    case "SET_SETTINGS":
      return { ...state, settings: action.payload };

    case "SET_HEALTH_DATA":
      return { ...state, healthData: action.payload };

    case "UPDATE_CALORIES_CONSUMED":
      return { ...state, todayCaloriesConsumed: action.payload };

    case "UPDATE_CALORIES_BURNED":
      return { ...state, todayCaloriesBurned: action.payload };

    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addFoodEntry: (entry: FoodEntry) => Promise<void>;
  addToFavorites: (foodItem: FoodItem) => Promise<void>;
  removeFromFavorites: (foodItemId: string) => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
  getTodayData: () => DayData;
  refreshData: () => Promise<void>;
} | null>(null);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper function to get today's date string
  const getTodayDateString = (): string => {
    return new Date().toISOString().split("T")[0];
  };

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Load today's entries
        const todayEntries = await StorageService.getDayEntries(
          getTodayDateString()
        );
        dispatch({ type: "SET_TODAY_ENTRIES", payload: todayEntries });

        // Load favorites
        const favorites = await StorageService.getFavorites();
        dispatch({ type: "SET_FAVORITES", payload: favorites });

        // Load settings
        const settings = await StorageService.getSettings();
        dispatch({ type: "SET_SETTINGS", payload: settings });

        // Load health data
        const healthData = await StorageService.getHealthData();
        dispatch({ type: "SET_HEALTH_DATA", payload: healthData });
      } catch (error) {
        console.error("Error initializing app:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load app data" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeApp();
  }, []);

  // Helper functions
  const addFoodEntry = async (entry: FoodEntry): Promise<void> => {
    try {
      await StorageService.addFoodEntry(entry);
      dispatch({ type: "ADD_FOOD_ENTRY", payload: entry });
    } catch (error) {
      console.error("Error adding food entry:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to add food entry" });
    }
  };

  const addToFavorites = async (foodItem: FoodItem): Promise<void> => {
    try {
      await StorageService.addToFavorites(foodItem);
      dispatch({
        type: "ADD_FAVORITE",
        payload: { ...foodItem, isFavorite: true },
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to add to favorites" });
    }
  };

  const removeFromFavorites = async (foodItemId: string): Promise<void> => {
    try {
      await StorageService.removeFromFavorites(foodItemId);
      dispatch({ type: "REMOVE_FAVORITE", payload: foodItemId });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to remove from favorites",
      });
    }
  };

  const updateSettings = async (settings: UserSettings): Promise<void> => {
    try {
      await StorageService.saveSettings(settings);
      dispatch({ type: "SET_SETTINGS", payload: settings });
    } catch (error) {
      console.error("Error updating settings:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update settings" });
    }
  };

  const getTodayData = (): DayData => {
    return {
      date: getTodayDateString(),
      entries: state.todayEntries,
      totalCaloriesConsumed: state.todayCaloriesConsumed,
      totalCaloriesBurned: state.todayCaloriesBurned,
      netCalories: state.todayCaloriesConsumed - state.todayCaloriesBurned,
    };
  };

  const refreshData = async (): Promise<void> => {
    // Refresh today's entries
    const todayEntries = await StorageService.getDayEntries(
      getTodayDateString()
    );
    dispatch({ type: "SET_TODAY_ENTRIES", payload: todayEntries });

    // Refresh favorites
    const favorites = await StorageService.getFavorites();
    dispatch({ type: "SET_FAVORITES", payload: favorites });
  };

  const contextValue = {
    state,
    dispatch,
    addFoodEntry,
    addToFavorites,
    removeFromFavorites,
    updateSettings,
    getTodayData,
    refreshData,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
