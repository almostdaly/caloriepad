import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodItem } from "@/types";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface SuggestionsListProps {
  currentFood: string;
  suggestions: FoodItem[];
  onSelectSuggestion: (food: FoodItem) => void;
  onSelectCustom: () => void;
  visible: boolean;
}

export function SuggestionsList({
  currentFood,
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
          backgroundColor:
            colorScheme === "dark" ? colors.cardBackground : "#FFFFFF",
          borderColor: colors.separator,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: colorScheme === "dark" ? 0.4 : 0.15,
          shadowRadius: 16,
          elevation: 12,
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
                  { color: colors.textSecondary },
                ]}
              >
                {food.caloriesPerServing} cal
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}

        {/* Custom food option */}
        {suggestions.length > 0 && (
          <ThemedView
            style={[styles.separator, { backgroundColor: colors.separator }]}
          />
        )}

        <Pressable
          style={[
            styles.suggestion,
            styles.customSuggestion,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? colors.backgroundSecondary
                  : colors.backgroundSecondary,
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
            <ThemedText style={[styles.customText, { color: colors.tint }]}>
              Add &quot;{currentFood}&quot; as custom food
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
    maxHeight: 200,
    borderRadius: 16,
    marginTop: 8,
    zIndex: 1000,
    overflow: "hidden",
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  suggestionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  suggestionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
  },
  suggestionCalories: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 50,
    textAlign: "right",
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  customSuggestion: {
    paddingVertical: 16,
  },
  customText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});
