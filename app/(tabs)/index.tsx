import { CalorieStatCard } from "@/components/CalorieStatCard";
import { GoalProgressCard } from "@/components/GoalProgressCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TodayEntriesList } from "@/components/TodayEntriesList";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function TodayScreen() {
  const { state } = useApp();
  const {
    todayEntries,
    todayCaloriesConsumed,
    todayCaloriesBurned,
    settings,
    loading,
  } = state;
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading today&apos;s data...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const handleViewAllEntries = () => {
    // TODO: Navigate to full entries list
    console.log("View all entries");
  };

  // Calculate net calories (consumed - burned)
  const netCalories = todayCaloriesConsumed - (todayCaloriesBurned || 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Today</ThemedText>
          <ThemedText type="default" style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </ThemedText>
        </ThemedView>

        {/* Calorie Summary Cards */}
        <ThemedView style={styles.summarySection}>
          <CalorieStatCard
            title="Consumed"
            value={todayCaloriesConsumed}
            iconName="fork.knife"
            color={Colors[colorScheme ?? "light"].healthOrange}
          />
          <CalorieStatCard
            title="Burned"
            value={todayCaloriesBurned || 0}
            iconName="flame"
            color={Colors[colorScheme ?? "light"].healthRed}
          />
          <CalorieStatCard
            title="Net"
            value={netCalories}
            iconName={netCalories >= 0 ? "plus.circle" : "minus.circle"}
            color={
              netCalories >= 0
                ? Colors[colorScheme ?? "light"].healthGreen
                : Colors[colorScheme ?? "light"].healthBlue
            }
          />
        </ThemedView>

        {/* Goal Progress */}
        <GoalProgressCard
          caloriesConsumed={todayCaloriesConsumed}
          dailyGoal={settings.dailyCalorieGoal}
        />

        {/* Today's Entries */}
        <TodayEntriesList
          entries={todayEntries}
          onViewAll={handleViewAllEntries}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  date: {
    marginTop: 4,
    opacity: 0.7,
  },
  summarySection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
});
