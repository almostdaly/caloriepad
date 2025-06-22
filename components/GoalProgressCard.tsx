import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface GoalProgressCardProps {
  caloriesConsumed: number;
  dailyGoal: number;
}

export function GoalProgressCard({
  caloriesConsumed,
  dailyGoal,
}: GoalProgressCardProps) {
  const colorScheme = useColorScheme();
  const remainingCalories = dailyGoal - caloriesConsumed;
  const progressPercentage = Math.min(
    (caloriesConsumed / dailyGoal) * 100,
    100
  );

  return (
    <ThemedView style={styles.goalSection}>
      <ThemedView style={styles.goalHeader}>
        <ThemedText type="subtitle">Daily Goal Progress</ThemedText>
        <ThemedText type="default" style={styles.goalTarget}>
          {dailyGoal} cal goal
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: Colors[colorScheme ?? "light"].separator },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor:
                  remainingCalories > 0
                    ? Colors[colorScheme ?? "light"].healthGreen
                    : Colors[colorScheme ?? "light"].healthRed,
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
        <ThemedView style={styles.progressLabels}>
          <ThemedText type="default" style={styles.progressLabel}>
            {Math.round(progressPercentage)}% complete
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={[
              styles.remainingText,
              {
                color:
                  remainingCalories > 0
                    ? Colors[colorScheme ?? "light"].healthGreen
                    : Colors[colorScheme ?? "light"].healthRed,
              },
            ]}
          >
            {remainingCalories > 0
              ? `${remainingCalories} cal left`
              : `${Math.abs(remainingCalories)} cal over`}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  goalSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  goalTarget: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
