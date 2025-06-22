import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StorageService } from "@/services/storage";
import { FoodEntry, FoodItem } from "@/types";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface RecentFoodsQuickAddProps {
  onSelectFood: (food: FoodItem) => void;
  refreshTrigger?: number;
}

export function RecentQuickAdd({
  onSelectFood,
  refreshTrigger,
}: RecentFoodsQuickAddProps) {
  const colorScheme = useColorScheme();
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    loadRecentFoods();
  }, [refreshTrigger]);

  const loadRecentFoods = async () => {
    try {
      // Get last 7 days of entries
      const today = new Date();
      const recentEntries: FoodEntry[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];

        const dayEntries = await StorageService.getDayEntries(dateString);
        recentEntries.push(...dayEntries);
      }

      // Get unique foods, sorted by most recent
      const uniqueFoods = new Map<
        string,
        { food: FoodItem; timestamp: Date }
      >();

      recentEntries.forEach((entry) => {
        const key = entry.foodItem.name.toLowerCase();
        // Ensure timestamp is a Date object
        const timestamp =
          entry.timestamp instanceof Date
            ? entry.timestamp
            : new Date(entry.timestamp);

        if (
          !uniqueFoods.has(key) ||
          uniqueFoods.get(key)!.timestamp < timestamp
        ) {
          uniqueFoods.set(key, {
            food: entry.foodItem,
            timestamp: timestamp,
          });
        }
      });

      // Convert to array and sort by timestamp (most recent first)
      const sortedFoods = Array.from(uniqueFoods.values())
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 8) // Show max 8 recent foods
        .map((item) => item.food);

      setRecentFoods(sortedFoods);
    } catch (error) {
      console.error("Error loading recent foods:", error);
    }
  };

  if (recentFoods.length === 0) {
    return null;
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
      <ThemedView style={[styles.header, { backgroundColor: "transparent" }]}>
        <IconSymbol name="clock" size={18} color={colors.icon} />
        <ThemedText
          type="defaultSemiBold"
          style={[styles.title, { color: colors.text }]}
        >
          Quick Add from Recent
        </ThemedText>
      </ThemedView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentFoods.map((food) => (
          <Pressable
            key={food.id}
            style={[
              styles.foodCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() => onSelectFood(food)}
          >
            <ThemedView
              style={[styles.cardContent, { backgroundColor: "transparent" }]}
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
              <ThemedText
                type="default"
                style={[styles.foodServing, { color: colors.textSecondary }]}
              >
                {food.servingSize}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  scrollContent: {
    paddingRight: 20,
    gap: 12,
  },
  foodCard: {
    width: 120,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  cardContent: {
    alignItems: "center",
    gap: 4,
  },
  foodName: {
    fontSize: 14,
    textAlign: "center",
    minHeight: 34, // Ensure consistent height for 2 lines
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: "600",
  },
  foodServing: {
    fontSize: 12,
    textAlign: "center",
  },
});
