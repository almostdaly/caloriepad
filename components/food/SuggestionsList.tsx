import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodItem } from "@/types";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface SuggestionsListProps {
  suggestions: FoodItem[];
  searchQuery: string;
  onSelectSuggestion: (food: FoodItem) => void;
  onSelectCustom: () => void;
  onBlur?: () => void;
}

export function SuggestionsList({
  suggestions,
  searchQuery,
  onSelectSuggestion,
  onSelectCustom,
  onBlur,
}: SuggestionsListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.separator,
          shadowColor: colors.text,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 4,
        },
      ]}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {suggestions.map((food) => (
          <Pressable
            key={food.id}
            style={[styles.suggestion, { borderBottomColor: colors.separator }]}
            onPress={() => onSelectSuggestion(food)}
          >
            <ThemedView
              style={[
                styles.suggestionContent,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedText
                type="default"
                style={styles.suggestionName}
                numberOfLines={2}
              >
                {food.name}
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.suggestionCalories, { color: colors.tint }]}
              >
                {food.caloriesPerServing} cal
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}

        {/* Custom "Use search text" option */}
        <Pressable
          style={[
            styles.suggestion,
            styles.customSuggestion,
            {
              borderBottomColor: colors.separator,
              backgroundColor: colors.backgroundSecondary + "40",
            },
          ]}
          onPress={onSelectCustom}
        >
          <ThemedView
            style={[
              styles.suggestionContent,
              { backgroundColor: "transparent" },
            ]}
          >
            <ThemedText
              type="default"
              style={[styles.suggestionName, { fontStyle: "italic" }]}
              numberOfLines={1}
            >
              Use &quot;{searchQuery}&quot;
            </ThemedText>
            <IconSymbol name="plus.circle" size={16} color={colors.tint} />
          </ThemedView>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 180,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    minHeight: 50,
  },
  suggestionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    gap: 8,
  },
  suggestionName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  suggestionCalories: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 45,
    textAlign: "right",
  },
  customSuggestion: {
    // Styling applied inline with colors
  },
});
