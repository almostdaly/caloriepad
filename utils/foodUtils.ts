import { FoodService } from "@/services/foodService";
import { FoodItem } from "@/types";

/**
 * Debounce utility for search functionality
 */
export function createDebouncer() {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return {
    debounce: (callback: () => void, delay: number) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(callback, delay);
    },
    clear: () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    },
  };
}

/**
 * Search foods with debouncing
 */
export async function searchFoodsWithDebounce(
  query: string,
  onResults: (results: FoodItem[]) => void,
  onError: (error: any) => void
) {
  if (query.trim().length <= 2) {
    onResults([]);
    return;
  }

  try {
    const results = await FoodService.searchFoods(query);
    onResults(results.slice(0, 6));
  } catch (error) {
    console.error("Error searching foods:", error);
    onError(error);
    onResults([]);
  }
}

/**
 * Calculate total calories from calories and quantity
 */
export function calculateTotalCalories(
  calories: number,
  quantity: number
): number {
  return calories * quantity;
}

/**
 * Adjust a numeric value with bounds checking
 */
export function adjustValue(
  currentValue: number,
  adjustment: number,
  min: number = 0,
  max?: number
): number {
  const newValue = currentValue + adjustment;
  if (newValue < min) return min;
  if (max !== undefined && newValue > max) return max;
  return newValue;
}
