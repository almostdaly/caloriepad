import foodDatabase from "@/data/foodDatabase.json";
import { FoodItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Service for managing food database and search functionality
 */
export class FoodService {
  private static foods: FoodItem[] = [];
  private static isInitialized = false;

  /**
   * Initialize the food database by loading from JSON and merging with user's personal foods
   */
  static async initializeFoodDatabase(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load base foods from JSON and convert dates
      const baseFoods = foodDatabase.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      })) as FoodItem[];

      // Load user's personal foods from AsyncStorage
      const personalFoods = await this.getPersonalFoods();

      // Merge base foods with personal foods (personal foods override base foods with same name)
      this.foods = [...baseFoods];

      // Add or update with personal foods
      personalFoods.forEach((personalFood) => {
        const existingIndex = this.foods.findIndex(
          (f) => f.name.toLowerCase() === personalFood.name.toLowerCase()
        );
        if (existingIndex >= 0) {
          // Update existing food with personal version
          this.foods[existingIndex] = personalFood;
        } else {
          // Add new personal food
          this.foods.push(personalFood);
        }
      });

      this.isInitialized = true;
      console.log(`Food database initialized with ${this.foods.length} foods`);
    } catch (error) {
      console.error("Error initializing food database:", error);
      throw error;
    }
  }

  /**
   * Get user's personal foods from AsyncStorage
   */
  private static async getPersonalFoods(): Promise<FoodItem[]> {
    try {
      const stored = await AsyncStorage.getItem("@caloriepad/personal_foods");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading personal foods:", error);
      return [];
    }
  }

  /**
   * Save user's personal foods to AsyncStorage
   */
  private static async savePersonalFoods(
    personalFoods: FoodItem[]
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "@caloriepad/personal_foods",
        JSON.stringify(personalFoods)
      );
    } catch (error) {
      console.error("Error saving personal foods:", error);
      throw error;
    }
  }

  /**
   * Add a custom food to the user's personal database
   */
  static async addCustomFood(food: FoodItem): Promise<void> {
    try {
      const personalFoods = await this.getPersonalFoods();

      // Add to personal foods
      personalFoods.push(food);
      await this.savePersonalFoods(personalFoods);

      // Add to in-memory cache
      this.foods.push(food);

      console.log(`Added custom food: ${food.name}`);
    } catch (error) {
      console.error("Error adding custom food:", error);
      throw error;
    }
  }

  /**
   * Update an existing food in the user's personal database
   */
  static async updateFood(updatedFood: FoodItem): Promise<void> {
    try {
      const personalFoods = await this.getPersonalFoods();

      // Find and update in personal foods, or add if not exists
      const existingIndex = personalFoods.findIndex(
        (f) => f.name.toLowerCase() === updatedFood.name.toLowerCase()
      );
      if (existingIndex >= 0) {
        personalFoods[existingIndex] = updatedFood;
      } else {
        personalFoods.push(updatedFood);
      }

      await this.savePersonalFoods(personalFoods);

      // Update in-memory cache
      const cacheIndex = this.foods.findIndex(
        (f) => f.name.toLowerCase() === updatedFood.name.toLowerCase()
      );
      if (cacheIndex >= 0) {
        this.foods[cacheIndex] = updatedFood;
      }

      console.log(`Updated food: ${updatedFood.name}`);
    } catch (error) {
      console.error("Error updating food:", error);
      throw error;
    }
  }

  /**
   * Get all foods from the database
   */
  static async getAllFoods(): Promise<FoodItem[]> {
    if (!this.foods.length) {
      await this.initializeFoodDatabase();
    }
    return this.foods;
  }

  /**
   * Search foods by name or category
   */
  static async searchFoods(query: string): Promise<FoodItem[]> {
    const allFoods = await this.getAllFoods();

    if (!query.trim()) {
      return allFoods;
    }

    const lowerQuery = query.toLowerCase();
    return allFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(lowerQuery) ||
        food.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get foods by category
   */
  static async getFoodsByCategory(
    category: "food" | "drink" | "snack"
  ): Promise<FoodItem[]> {
    const allFoods = await this.getAllFoods();
    return allFoods.filter((food) => food.category === category);
  }

  /**
   * Get a specific food by ID
   */
  static async getFoodById(id: string): Promise<FoodItem | null> {
    const allFoods = await this.getAllFoods();
    return allFoods.find((food) => food.id === id) || null;
  }

  /**
   * Get popular/recommended foods (top 10 by usage or favorites)
   */
  static async getPopularFoods(): Promise<FoodItem[]> {
    const allFoods = await this.getAllFoods();

    // For now, return first 10 foods
    // In the future, this would be based on usage analytics
    return allFoods.slice(0, 10);
  }

  /**
   * Get foods categorized for easy browsing
   */
  static async getCategorizedFoods(): Promise<{
    food: FoodItem[];
    drink: FoodItem[];
    snack: FoodItem[];
  }> {
    const allFoods = await this.getAllFoods();

    return {
      food: allFoods.filter((item) => item.category === "food"),
      drink: allFoods.filter((item) => item.category === "drink"),
      snack: allFoods.filter((item) => item.category === "snack"),
    };
  }
}
