import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Storage service for handling AsyncStorage operations
 */
export class StorageService {
  /**
   * Get data from AsyncStorage
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set data in AsyncStorage
   */
  static async set<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting data for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Remove data from AsyncStorage
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data from AsyncStorage
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      throw error;
    }
  }

  /**
   * Get multiple values from AsyncStorage
   */
  static async getMultiple<T>(
    keys: string[]
  ): Promise<Record<string, T | null>> {
    try {
      const keyValuePairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};

      keyValuePairs.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });

      return result;
    } catch (error) {
      console.error("Error getting multiple values:", error);
      throw error;
    }
  }
}
