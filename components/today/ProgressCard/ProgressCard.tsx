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
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <IconSymbol
            name="target"
            size={18}
            color={isOverGoal ? colors.healthRed : colors.healthGreen}
          />
          <ThemedText
            type="defaultSemiBold"
            style={[styles.title, { color: colors.text }]}
          >
            Daily Calories
          </ThemedText>
        </View>
        <ThemedText
          type="default"
          style={[styles.goalText, { color: colors.textSecondary }]}
        >
          {dailyGoal} target
        </ThemedText>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.backgroundTertiary },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: progress > 0 ? `${progress}%` : "2%",
                backgroundColor: isOverGoal
                  ? colors.healthRed
                  : colors.healthGreen,
                opacity: progress > 0 ? 1 : 0.3,
              },
            ]}
          />
        </View>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <ThemedText
          type="default"
          style={[styles.progressText, { color: colors.textSecondary }]}
        >
          {Math.round(progress)}% used
        </ThemedText>
        <ThemedText
          type="default"
          style={[
            styles.remainingText,
            {
              color: isOverGoal ? colors.healthRed : colors.healthGreen,
            },
          ]}
        >
          {isOverGoal
            ? `${caloriesConsumed - dailyGoal} over`
            : `${remaining} remaining`}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  goalText: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    marginBottom: 12,
    marginTop: 12,
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
