import { QuickAddFood } from "@/components/food/QuickAddFood";
import { RecentQuickAdd } from "@/components/food/RecentQuickAdd";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useApp } from "@/contexts/AppContext";
import { FoodEntry, FoodItem } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";

export default function AddScreen() {
  const { addFoodEntry } = useApp();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFoodAdded = () => {
    // Food was successfully added via quick add
    // Trigger refresh of recent foods
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSelectRecentFood = async (food: FoodItem) => {
    Alert.alert(
      "Add Food",
      `Add ${food.name} (${food.caloriesPerServing} calories) to your daily log?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          onPress: async () => {
            try {
              const entry: FoodEntry = {
                id: `entry-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                foodItem: food,
                quantity: 1,
                totalCalories: food.caloriesPerServing,
                timestamp: new Date(),
              };

              await addFoodEntry(entry);

              // Trigger refresh of recent foods
              setRefreshTrigger((prev) => prev + 1);

              Alert.alert(
                "Added!",
                `${food.name} has been added to your daily log.`,
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Error adding food:", error);
              Alert.alert(
                "Error",
                "Failed to add food entry. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Add Food</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Enter a food name and calories to add to your log
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <QuickAddFood
          onFoodAdded={handleFoodAdded}
          addFoodEntry={addFoodEntry}
        />

        <RecentQuickAdd
          onSelectFood={handleSelectRecentFood}
          refreshTrigger={refreshTrigger}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
});
