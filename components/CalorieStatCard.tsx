import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

interface CalorieStatCardProps {
  title: string;
  value: number;
  iconName: any; // SF Symbol name
  color: string;
}

export function CalorieStatCard({
  title,
  value,
  iconName,
  color,
}: CalorieStatCardProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView
      style={[
        styles.card,
        { backgroundColor: Colors[colorScheme ?? "light"].cardBackground },
      ]}
    >
      <View style={styles.cardHeader}>
        <IconSymbol name={iconName} size={22} color={color} />
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {title}
        </ThemedText>
      </View>
      <ThemedText type="title" style={[styles.calorieNumber, { color }]}>
        {value}
      </ThemedText>
      <ThemedText type="default" style={styles.calorieLabel}>
        calories
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 7,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  calorieNumber: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  calorieLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});
