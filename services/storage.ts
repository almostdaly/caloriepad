import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FoodEntry,
  FoodItem,
  HealthData,
  STORAGE_KEYS,
  UserOnboardingStatus,
  UserSettings,
} from "../types";

/**
 * Storage service for managing local data persistence
 */
export class StorageService {
  // Food entries by date
  static async getDayEntries(date: string): Promise<FoodEntry[]> {
    try {
      const data = await AsyncStorage.getItem(
        `${STORAGE_KEYS.DAILY_ENTRIES}${date}`
      );
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting day entries:", error);
      return [];
    }
  }

  static async saveDayEntries(
    date: string,
    entries: FoodEntry[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.DAILY_ENTRIES}${date}`,
        JSON.stringify(entries)
      );
    } catch (error) {
      console.error("Error saving day entries:", error);
    }
  }

  static async addFoodEntry(entry: FoodEntry): Promise<void> {
    const date = new Date(entry.timestamp).toISOString().split("T")[0];
    const entries = await this.getDayEntries(date);
    entries.push(entry);
    await this.saveDayEntries(date, entries);
  }

  // Favorites
  static async getFavorites(): Promise<FoodItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting favorites:", error);
      return [];
    }
  }

  static async saveFavorites(favorites: FoodItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }

  static async addToFavorites(foodItem: FoodItem): Promise<void> {
    const favorites = await this.getFavorites();
    const updatedFavorites = [...favorites, { ...foodItem, isFavorite: true }];
    await this.saveFavorites(updatedFavorites);
  }

  static async removeFromFavorites(foodItemId: string): Promise<void> {
    const favorites = await this.getFavorites();
    const updatedFavorites = favorites.filter((item) => item.id !== foodItemId);
    await this.saveFavorites(updatedFavorites);
  }

  // User settings
  static async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      const defaultSettings: UserSettings = {
        dailyCalorieGoal: 2000,
        healthKitEnabled: false,
        notifications: true,
        theme: "system",
      };
      return data
        ? { ...defaultSettings, ...JSON.parse(data) }
        : defaultSettings;
    } catch (error) {
      console.error("Error getting settings:", error);
      return {
        dailyCalorieGoal: 2000,
        healthKitEnabled: false,
        notifications: true,
        theme: "system",
      };
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }

  // Onboarding status
  static async getOnboardingStatus(): Promise<UserOnboardingStatus> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_STATUS);
      const defaultStatus: UserOnboardingStatus = {
        hasOnboarded: false,
        healthPermissionsRequested: false,
        healthPermissionsGranted: false,
      };
      return data ? { ...defaultStatus, ...JSON.parse(data) } : defaultStatus;
    } catch (error) {
      console.error("Error getting onboarding status:", error);
      return {
        hasOnboarded: false,
        healthPermissionsRequested: false,
        healthPermissionsGranted: false,
      };
    }
  }

  static async saveOnboardingStatus(
    status: UserOnboardingStatus
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ONBOARDING_STATUS,
        JSON.stringify(status)
      );
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  }

  // Health data cache
  static async getHealthData(): Promise<HealthData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_CACHE);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting health data:", error);
      return null;
    }
  }

  static async saveHealthData(healthData: HealthData): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.HEALTH_CACHE,
        JSON.stringify(healthData)
      );
    } catch (error) {
      console.error("Error saving health data:", error);
    }
  }

  // Food database
  static async getFoodDatabase(): Promise<FoodItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOOD_DATABASE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting food database:", error);
      return [];
    }
  }

  static async saveFoodDatabase(foods: FoodItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FOOD_DATABASE,
        JSON.stringify(foods)
      );
    } catch (error) {
      console.error("Error saving food database:", error);
    }
  }

  // ============================================================================
  // DEVELOPER TOOLS - Only accessible in development mode
  // ============================================================================

  /**
   * Reset today's food entries only
   */
  static async resetTodayLog(): Promise<void> {
    try {
      const today = new Date().toISOString().split("T")[0];
      await AsyncStorage.removeItem(`${STORAGE_KEYS.DAILY_ENTRIES}${today}`);
      console.log("Today's log reset successfully");
    } catch (error) {
      console.error("Error resetting today's log:", error);
      throw error;
    }
  }

  /**
   * Reset custom food database (keeps built-in foods)
   */
  static async resetCustomFoodData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FOOD_DATABASE);
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
      console.log("Custom food data reset successfully");
    } catch (error) {
      console.error("Error resetting custom food data:", error);
      throw error;
    }
  }

  /**
   * Factory reset - clears all app data and forces re-onboarding
   * This will require health permissions to be re-requested
   */
  static async factoryReset(): Promise<void> {
    try {
      await AsyncStorage.clear();

      // Also trigger health permission reset
      const { HealthService } = await import("./healthService");
      await HealthService.resetPermissions();

      console.log(
        "Factory reset completed - all data cleared and health permissions reset"
      );
    } catch (error) {
      console.error("Error performing factory reset:", error);
      throw error;
    }
  }

  /**
   * Get storage statistics for developer debugging
   */
  static async getStorageStats(): Promise<{
    totalKeys: number;
    approximateSize: number;
    keysByCategory: Record<string, number>;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      const keysByCategory: Record<string, number> = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }

        // Categorize keys
        if (key.includes("entries_")) {
          keysByCategory.entries = (keysByCategory.entries || 0) + 1;
        } else if (key.includes("food_database")) {
          keysByCategory.foodDatabase = (keysByCategory.foodDatabase || 0) + 1;
        } else if (key.includes("settings")) {
          keysByCategory.settings = (keysByCategory.settings || 0) + 1;
        } else if (key.includes("health")) {
          keysByCategory.health = (keysByCategory.health || 0) + 1;
        } else {
          keysByCategory.other = (keysByCategory.other || 0) + 1;
        }
      }

      return {
        totalKeys: keys.length,
        approximateSize: totalSize,
        keysByCategory,
      };
    } catch (error) {
      console.error("Error getting storage stats:", error);
      return {
        totalKeys: 0,
        approximateSize: 0,
        keysByCategory: {},
      };
    }
  }

  // Utility methods
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }

  static async getStorageInfo(): Promise<{
    keys: readonly string[];
    size: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Approximate size calculation
      let totalSize = 0;
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      return { keys, size: totalSize };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return { keys: [], size: 0 };
    }
  }
}
