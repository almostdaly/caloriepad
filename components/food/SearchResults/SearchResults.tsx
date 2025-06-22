import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodItem } from "@/types";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface SearchResultsProps {
  foods: FoodItem[];
  loading: boolean;
  onSelectFood: (food: FoodItem) => void;
  hasSearched: boolean;
}

export function SearchResults({
  foods,
  loading,
  onSelectFood,
  hasSearched,
}: SearchResultsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (!hasSearched) return null;

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={{ color: colors.text }}>Searching...</ThemedText>
        </ThemedView>
      ) : foods.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol
            name="exclamationmark.circle"
            size={32}
            color={colors.icon}
          />
          <ThemedText
            type="subtitle"
            style={[styles.emptyTitle, { color: colors.text }]}
          >
            No foods found
          </ThemedText>
          <ThemedText
            type="default"
            style={[styles.emptySubtitle, { color: colors.textSecondary }]}
          >
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
                backgroundColor: colors.cardBackground,
                borderColor: colors.separator,
              },
            ]}
            onPress={() => onSelectFood(food)}
          >
            <ThemedView
              style={[styles.foodContent, { backgroundColor: "transparent" }]}
            >
              <ThemedView
                style={[styles.foodHeader, { backgroundColor: "transparent" }]}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.foodName, { color: colors.text }]}
                  numberOfLines={2}
                >
                  {food.name}
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[styles.foodCalories, { color: colors.healthOrange }]}
                >
                  {food.caloriesPerServing} cal
                </ThemedText>
              </ThemedView>
              <ThemedText
                type="default"
                style={[styles.foodDetails, { color: colors.textSecondary }]}
              >
                {food.servingSize} • {food.category}
              </ThemedText>
            </ThemedView>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptySubtitle: {
    textAlign: "center",
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  foodContent: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 12,
  },
  foodName: {
    flex: 1,
    fontSize: 16,
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 70,
    textAlign: "right",
  },
  foodDetails: {
    fontSize: 14,
  },
});
