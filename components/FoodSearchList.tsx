import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodService } from "@/services/foodService";
import { FoodItem } from "@/types";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

interface FoodSearchListProps {
  onSelectFood: (food: FoodItem) => void;
}

export function FoodSearchList({ onSelectFood }: FoodSearchListProps) {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "food" | "drink" | "snack"
  >("all");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setHasSearched(true);
      searchFoods();
    } else {
      setHasSearched(false);
      setFoods([]);
    }
  }, [searchQuery, selectedCategory]);

  const searchFoods = async () => {
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
  };

  const getCategoryIcon = (category: string): any => {
    switch (category) {
      case "food":
        return "fork.knife";
      case "drink":
        return "cup.and.saucer";
      case "snack":
        return "circle.fill";
      default:
        return "list.bullet";
    }
  };

  const categories = [
    { key: "all", label: "All", icon: "list.bullet" as any },
    { key: "food", label: "Food", icon: "fork.knife" as any },
    { key: "drink", label: "Drinks", icon: "cup.and.saucer" as any },
    { key: "snack", label: "Snacks", icon: "circle.fill" as any },
  ] as const;

  return (
    <ThemedView style={styles.container}>
      {/* Search Bar */}
      <ThemedView
        style={[
          styles.searchContainer,
          { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
        ]}
      >
        <IconSymbol
          name="magnifyingglass"
          size={16}
          color={Colors[colorScheme ?? "light"].icon}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: Colors[colorScheme ?? "light"].text },
          ]}
          placeholder="Search foods..."
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <IconSymbol
              name="xmark.circle.fill"
              size={16}
              color={Colors[colorScheme ?? "light"].icon}
            />
          </Pressable>
        )}
      </ThemedView>

      {/* Category Filter - Only show when searching */}
      {hasSearched && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <Pressable
              key={category.key}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === category.key
                      ? Colors[colorScheme ?? "light"].tint
                      : Colors[colorScheme ?? "light"].backgroundSecondary,
                  borderColor:
                    selectedCategory === category.key
                      ? Colors[colorScheme ?? "light"].tint
                      : Colors[colorScheme ?? "light"].separator,
                },
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <IconSymbol
                name={category.icon}
                size={14}
                color={
                  selectedCategory === category.key
                    ? "white"
                    : Colors[colorScheme ?? "light"].icon
                }
              />
              <ThemedText
                type="default"
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.key
                        ? "white"
                        : Colors[colorScheme ?? "light"].text,
                  },
                ]}
              >
                {category.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Results - Only show when searching */}
      {hasSearched ? (
        <ScrollView style={styles.resultsList}>
          {loading ? (
            <ThemedView style={styles.loadingContainer}>
              <ThemedText>Searching...</ThemedText>
            </ThemedView>
          ) : foods.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <IconSymbol
                name="exclamationmark.circle"
                size={32}
                color={Colors[colorScheme ?? "light"].icon}
              />
              <ThemedText type="subtitle" style={styles.emptyTitle}>
                No foods found
              </ThemedText>
              <ThemedText type="default" style={styles.emptySubtitle}>
                Try a different search term
              </ThemedText>
            </ThemedView>
          ) : (
            foods.map((food) => (
              <Pressable
                key={food.id}
                style={[
                  styles.foodItem,
                  {
                    backgroundColor:
                      Colors[colorScheme ?? "light"].cardBackground,
                  },
                ]}
                onPress={() => onSelectFood(food)}
              >
                <ThemedView style={styles.foodHeader}>
                  <IconSymbol
                    name={getCategoryIcon(food.category)}
                    size={20}
                    color={Colors[colorScheme ?? "light"].tint}
                  />
                  <ThemedView style={styles.foodInfo}>
                    <ThemedText type="defaultSemiBold">{food.name}</ThemedText>
                    <ThemedText type="default" style={styles.servingSize}>
                      {food.servingSize}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.calorieInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.calories}>
                      {food.caloriesPerServing}
                    </ThemedText>
                    <ThemedText type="default" style={styles.calorieLabel}>
                      cal
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            ))
          )}
        </ScrollView>
      ) : (
        // Placeholder when not searching
        <ThemedView style={styles.placeholderContainer}>
          <IconSymbol
            name="magnifyingglass"
            size={48}
            color={Colors[colorScheme ?? "light"].icon}
          />
          <ThemedText type="subtitle" style={styles.placeholderTitle}>
            Search for Foods
          </ThemedText>
          <ThemedText type="default" style={styles.placeholderSubtitle}>
            Start typing to find foods from our database
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: -100, // Center it better
  },
  placeholderTitle: {
    marginTop: 16,
    textAlign: "center",
  },
  placeholderSubtitle: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  foodItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  foodHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  foodInfo: {
    flex: 1,
  },
  servingSize: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  calorieInfo: {
    alignItems: "flex-end",
  },
  calories: {
    fontSize: 18,
    color: "#FF9500",
  },
  calorieLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});
