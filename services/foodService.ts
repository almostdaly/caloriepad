import { FoodItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Service for managing food database and search functionality
 * Uses Open Food Facts API (unlimited, no API key) with local custom foods overlay
 */
export class FoodService {
  private static readonly OPEN_FOOD_FACTS_API =
    "https://world.openfoodfacts.org/cgi/search.pl";
  private static customFoods: FoodItem[] = [];
  private static isInitialized = false;

  /**
   * Initialize the food service by loading custom foods
   */
  static async initializeFoodDatabase(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load user's custom foods from AsyncStorage
      this.customFoods = await this.getCustomFoods();
      this.isInitialized = true;
      console.log(
        `Food service initialized with ${this.customFoods.length} custom foods`
      );
    } catch (error) {
      console.error("Error initializing food service:", error);
      throw error;
    }
  }

  /**
   * Get user's custom foods from AsyncStorage
   */
  private static async getCustomFoods(): Promise<FoodItem[]> {
    try {
      const stored = await AsyncStorage.getItem("@caloriepad/custom_foods");
      if (!stored) return [];

      const foods = JSON.parse(stored);
      return foods.map((food: any) => ({
        ...food,
        createdAt: new Date(food.createdAt),
      }));
    } catch (error) {
      console.error("Error loading custom foods:", error);
      return [];
    }
  }

  /**
   * Save user's custom foods to AsyncStorage
   */
  private static async saveCustomFoods(customFoods: FoodItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        "@caloriepad/custom_foods",
        JSON.stringify(customFoods)
      );
    } catch (error) {
      console.error("Error saving custom foods:", error);
      throw error;
    }
  }

  /**
   * Search foods using Open Food Facts API + local custom foods
   */
  static async searchFoods(query: string): Promise<FoodItem[]> {
    if (!this.isInitialized) {
      await this.initializeFoodDatabase();
    }

    if (!query.trim()) {
      return this.customFoods.slice(0, 10); // Return recent custom foods if no query
    }

    try {
      // Search both Open Food Facts API and custom foods in parallel
      const [openFoodFactsResults, customResults] = await Promise.all([
        this.searchOpenFoodFactsFoods(query),
        this.searchCustomFoods(query),
      ]);

      // Combine results, prioritizing custom foods
      const combinedResults = [...customResults, ...openFoodFactsResults];

      // Remove duplicates by name (case-insensitive)
      const uniqueResults = combinedResults.filter(
        (food, index, arr) =>
          arr.findIndex(
            (f) => f.name.toLowerCase() === food.name.toLowerCase()
          ) === index
      );

      return uniqueResults.slice(0, 20); // Limit to 20 results
    } catch (error) {
      console.error("Error searching foods:", error);
      // Fallback to custom foods only
      return this.searchCustomFoods(query);
    }
  }

  /**
   * Search Open Food Facts API
   */
  private static async searchOpenFoodFactsFoods(
    query: string
  ): Promise<FoodItem[]> {
    try {
      // Use more specific search parameters for better name matching
      const url = `${
        this.OPEN_FOOD_FACTS_API
      }?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,nutriments,categories`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open Food Facts API error: ${response.status}`);
      }

      const data = await response.json();

      const results =
        data.products
          ?.filter((product: any) => {
            // Filter to only include products that have the search query in their name
            const productName = product.product_name?.toLowerCase() || "";
            const searchQuery = query.toLowerCase();

            // Must contain the search term in the product name
            return (
              productName.includes(searchQuery) &&
              productName.length > 0 &&
              product.nutriments?.["energy-kcal_100g"]
            );
          })
          .map((food: any) => this.mapOpenFoodFactsFoodToFoodItem(food)) || [];

      return results;
    } catch (error) {
      console.error("Error searching Open Food Facts foods:", error);
      return [];
    }
  }

  /**
   * Clean and shorten food names for better display
   */
  private static cleanFoodName(name: string): string {
    // Remove common Open Food Facts prefixes
    let cleaned = name
      .replace(/^Fast foods?,?\s*/i, "")
      .replace(/^Restaurant?,?\s*/i, "")
      .replace(/^Brand name,?\s*/i, "")
      .replace(/^Prepared,?\s*/i, "");

    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    // Limit length and add ellipsis if needed
    if (cleaned.length > 45) {
      cleaned = cleaned.substring(0, 42) + "...";
    }

    return cleaned;
  }

  /**
   * Map Open Food Facts API response to our FoodItem format
   */
  private static mapOpenFoodFactsFoodToFoodItem(
    openFoodFactsFood: any
  ): FoodItem {
    // Get calories from nutriments (energy in kcal per 100g)
    const calories =
      openFoodFactsFood.nutriments?.["energy-kcal_100g"] ||
      openFoodFactsFood.nutriments?.["energy-kcal"] ||
      openFoodFactsFood.nutriments?.energy_value ||
      0;

    return {
      id: `off-${openFoodFactsFood.code || Date.now()}`,
      name: this.cleanFoodName(
        openFoodFactsFood.product_name || "Unknown Food"
      ),
      caloriesPerServing: Math.round(calories),
      servingSize: "100g",
      category: this.categorizeOpenFoodFactsFood(
        openFoodFactsFood.categories || ""
      ),
      isFavorite: false,
      createdAt: new Date(),
      isUSDAFood: false, // Flag to identify API foods (keeping same name for compatibility)
    };
  }

  /**
   * Categorize Open Food Facts food into our categories
   */
  private static categorizeOpenFoodFactsFood(
    category: string
  ): "food" | "drink" | "snack" {
    const categoryLower = category?.toLowerCase() || "";

    if (
      categoryLower.includes("beverage") ||
      categoryLower.includes("drink") ||
      categoryLower.includes("juice") ||
      categoryLower.includes("tea") ||
      categoryLower.includes("coffee")
    ) {
      return "drink";
    }

    if (
      categoryLower.includes("snack") ||
      categoryLower.includes("candy") ||
      categoryLower.includes("cookie") ||
      categoryLower.includes("chip")
    ) {
      return "snack";
    }

    return "food";
  }

  /**
   * Search custom foods locally
   */
  private static async searchCustomFoods(query: string): Promise<FoodItem[]> {
    const lowerQuery = query.toLowerCase();
    return this.customFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(lowerQuery) ||
        food.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Add a custom food to the user's local database
   */
  static async addCustomFood(food: FoodItem): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initializeFoodDatabase();
      }

      // Add to custom foods
      this.customFoods.push(food);
      await this.saveCustomFoods(this.customFoods);

      console.log(`Added custom food: ${food.name}`);
    } catch (error) {
      console.error("Error adding custom food:", error);
      throw error;
    }
  }

  /**
   * Update an existing custom food (only for user-created foods)
   */
  static async updateFood(updatedFood: FoodItem): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initializeFoodDatabase();
      }

      // Only update if it's a custom food (not Open Food Facts food)
      if (updatedFood.isUSDAFood) {
        throw new Error(
          "Cannot update Open Food Facts foods - create a custom version instead"
        );
      }

      const existingIndex = this.customFoods.findIndex(
        (f) =>
          f.id === updatedFood.id ||
          f.name.toLowerCase() === updatedFood.name.toLowerCase()
      );

      if (existingIndex >= 0) {
        this.customFoods[existingIndex] = updatedFood;
      } else {
        this.customFoods.push(updatedFood);
      }

      await this.saveCustomFoods(this.customFoods);
      console.log(`Updated custom food: ${updatedFood.name}`);
    } catch (error) {
      console.error("Error updating food:", error);
      throw error;
    }
  }

  /**
   * Get all custom foods
   */
  static async getAllFoods(): Promise<FoodItem[]> {
    if (!this.isInitialized) {
      await this.initializeFoodDatabase();
    }
    return this.customFoods;
  }

  /**
   * Get foods by category (custom foods only)
   */
  static async getFoodsByCategory(
    category: "food" | "drink" | "snack"
  ): Promise<FoodItem[]> {
    if (!this.isInitialized) {
      await this.initializeFoodDatabase();
    }
    return this.customFoods.filter((food) => food.category === category);
  }

  /**
   * Get a specific food by ID
   */
  static async getFoodById(id: string): Promise<FoodItem | null> {
    if (!this.isInitialized) {
      await this.initializeFoodDatabase();
    }
    return this.customFoods.find((food) => food.id === id) || null;
  }

  /**
   * Get popular/recommended foods (recent custom foods)
   */
  static async getPopularFoods(): Promise<FoodItem[]> {
    if (!this.isInitialized) {
      await this.initializeFoodDatabase();
    }
    return this.customFoods.slice(0, 10);
  }

  /**
   * Get categorized custom foods
   */
  static async getCategorizedFoods(): Promise<{
    food: FoodItem[];
    drink: FoodItem[];
    snack: FoodItem[];
  }> {
    if (!this.isInitialized) {
      await this.initializeFoodDatabase();
    }

    return {
      food: this.customFoods.filter((f) => f.category === "food"),
      drink: this.customFoods.filter((f) => f.category === "drink"),
      snack: this.customFoods.filter((f) => f.category === "snack"),
    };
  }
}
