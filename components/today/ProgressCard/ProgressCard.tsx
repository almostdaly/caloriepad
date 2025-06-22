import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressCardProps {
  caloriesConsumed: number;
  dailyGoal: number;
}

export function ProgressCard({
  caloriesConsumed,
  dailyGoal,
}: ProgressCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const progress = Math.min((caloriesConsumed / dailyGoal) * 100, 100);
  const isOverGoal = caloriesConsumed > dailyGoal;
  const remaining = Math.max(dailyGoal - caloriesConsumed, 0);

  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={styles.header}>
        <IconSymbol
          name="target"
          size={20}
          color={isOverGoal ? colors.healthRed : colors.healthGreen}
        />
        <ThemedText
          type="defaultSemiBold"
          style={[styles.title, { color: colors.text }]}
        >
          Daily Goal Progress
        </ThemedText>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: isOverGoal
                  ? colors.healthRed
                  : colors.healthGreen,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <ThemedText
            type="title"
            style={[
              styles.statValue,
              { color: isOverGoal ? colors.healthRed : colors.healthGreen },
            ]}
          >
            {Math.round(progress)}%
          </ThemedText>
          <ThemedText
            type="default"
            style={[styles.statLabel, { color: colors.textSecondary }]}
          >
            of goal
          </ThemedText>
        </View>

        <View style={styles.statItem}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.statValue, { color: colors.text }]}
          >
            {remaining}
          </ThemedText>
          <ThemedText
            type="default"
            style={[styles.statLabel, { color: colors.textSecondary }]}
          >
            {isOverGoal ? "over goal" : "remaining"}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
});
