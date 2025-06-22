import { FoodItem } from "@/types";

/**
 * Service for handling food search operations with Open Food Facts API
 */
export class FoodSearchService {
  private static readonly OPEN_FOOD_FACTS_API =
    "https://world.openfoodfacts.org/cgi/search.pl";

  /**
   * Search Open Food Facts API
   */
  static async searchAPI(query: string): Promise<FoodItem[]> {
    try {
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
            const productName = product.product_name?.toLowerCase() || "";
            const searchQuery = query.toLowerCase();

            return (
              productName.includes(searchQuery) &&
              productName.length > 0 &&
              product.nutriments?.["energy-kcal_100g"]
            );
          })
          .map((food: any) => this.mapAPIFoodToFoodItem(food)) || [];

      return results;
    } catch (error) {
      console.error("Error searching Open Food Facts foods:", error);
      return [];
    }
  }

  /**
   * Map Open Food Facts API response to our FoodItem format
   */
  private static mapAPIFoodToFoodItem(openFoodFactsFood: any): FoodItem {
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
      category: this.categorizeFood(openFoodFactsFood.categories || ""),
      isFavorite: false,
      createdAt: new Date(),
      isUSDAFood: false,
    };
  }

  /**
   * Clean and shorten food names for better display
   */
  private static cleanFoodName(name: string): string {
    let cleaned = name
      .replace(/^Fast foods?,?\s*/i, "")
      .replace(/^Restaurant?,?\s*/i, "")
      .replace(/^Brand name,?\s*/i, "")
      .replace(/^Prepared,?\s*/i, "");

    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    if (cleaned.length > 45) {
      cleaned = cleaned.substring(0, 42) + "...";
    }

    return cleaned;
  }

  /**
   * Categorize food based on Open Food Facts categories
   */
  private static categorizeFood(category: string): "food" | "drink" | "snack" {
    const lowerCategory = category.toLowerCase();

    if (
      lowerCategory.includes("beverage") ||
      lowerCategory.includes("drink") ||
      lowerCategory.includes("juice") ||
      lowerCategory.includes("coffee") ||
      lowerCategory.includes("tea") ||
      lowerCategory.includes("soda")
    ) {
      return "drink";
    }

    if (
      lowerCategory.includes("snack") ||
      lowerCategory.includes("chip") ||
      lowerCategory.includes("cookie") ||
      lowerCategory.includes("candy") ||
      lowerCategory.includes("chocolate")
    ) {
      return "snack";
    }

    return "food";
  }
}
