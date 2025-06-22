import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodItem } from "@/types";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface SuggestionsListProps {
  suggestions: FoodItem[];
  onSelectSuggestion: (food: FoodItem) => void;
  onSelectCustom: () => void;
  visible: boolean;
}

export function SuggestionsList({
  suggestions,
  onSelectSuggestion,
  onSelectCustom,
  visible,
}: SuggestionsListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (!visible) return null;

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.separator,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {suggestions.map((food, index) => (
          <Pressable
            key={food.id}
            style={[
              styles.suggestion,
              {
                borderBottomColor: colors.separator,
                borderBottomWidth: index < suggestions.length - 1 ? 0.5 : 0,
              },
            ]}
            onPress={() => onSelectSuggestion(food)}
          >
            <ThemedView
              style={[
                styles.suggestionContent,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedText
                style={[styles.suggestionName, { color: colors.text }]}
                numberOfLines={2}
              >
                {food.name}
              </ThemedText>
              <ThemedText
                style={[
                  styles.suggestionCalories,
                  { color: colors.healthOrange },
                ]}
              >
                {food.caloriesPerServing}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}

        {/* Custom food option */}
        <Pressable
          style={[
            styles.suggestion,
            styles.customSuggestion,
            {
              backgroundColor: colors.backgroundSecondary,
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
            <ThemedText style={[styles.suggestionName, { color: colors.tint }]}>
              Use custom food
            </ThemedText>
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
    borderTopWidth: 0.5,
  },
});
