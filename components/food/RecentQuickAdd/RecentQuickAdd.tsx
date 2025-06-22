import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StorageService } from "@/services/storage";
import { FoodEntry, FoodItem } from "@/types";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

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
        .slice(0, 4) // Show max 3 recent foods
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

      <ThemedView style={[styles.foodList, { backgroundColor: "transparent" }]}>
        {recentFoods.map((food) => (
          <Pressable
            key={food.id}
            style={[
              styles.foodRow,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.separator,
              },
            ]}
            onPress={() => onSelectFood(food)}
          >
            <ThemedView
              style={[styles.rowContent, { backgroundColor: "transparent" }]}
            >
              <ThemedText
                style={[styles.foodName, { color: colors.text }]}
                numberOfLines={1}
              >
                {food.name}
              </ThemedText>
              <ThemedView
                style={[
                  styles.rightContent,
                  { backgroundColor: "transparent" },
                ]}
              >
                <ThemedText
                  type="default"
                  style={[styles.foodCalories, { color: colors.text }]}
                >
                  {food.caloriesPerServing} cal
                </ThemedText>
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  color={colors.textSecondary}
                />
              </ThemedView>
            </ThemedView>
          </Pressable>
        ))}
      </ThemedView>
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
  foodList: {
    gap: 8,
  },
  foodRow: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodName: {
    fontSize: 16,
    flex: 1,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  foodCalories: {
    fontSize: 14,
    fontWeight: "600",
  },
});
