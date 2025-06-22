import { ThemedView } from "@/components/ui/ThemedView";
import { FoodService } from "@/services/foodService";
import { FoodItem } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { CategoryFilter } from "../CategoryFilter";
import { SearchBar } from "../SearchBar";
import { SearchResults } from "../SearchResults";

interface FoodSearchListProps {
  onSelectFood: (food: FoodItem) => void;
}

export function FoodSearchList({ onSelectFood }: FoodSearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "food" | "drink" | "snack"
  >("all");
  const [hasSearched, setHasSearched] = useState(false);

  const searchFoods = useCallback(async () => {
    if (!searchQuery.trim()) {
      setFoods([]);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await FoodService.searchFoods(searchQuery);
      const filteredResults =
        selectedCategory === "all"
          ? searchResults
          : searchResults.filter((food) => food.category === selectedCategory);
      setFoods(filteredResults);
    } catch (error) {
      console.error("Error searching foods:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      searchFoods();
    } else {
      setHasSearched(false);
      setFoods([]);
    }
  }, [searchFoods, searchQuery, selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
    setFoods([]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={[styles.searchSection, { backgroundColor: "transparent" }]}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search foods..."
        />
      </ThemedView>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        visible={hasSearched}
      />

      <SearchResults
        foods={foods}
        loading={loading}
        onSelectFood={onSelectFood}
        hasSearched={hasSearched}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
