import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface StatCardProps {
  title: string;
  value: number;
  iconName: any; // SF Symbol name
  color: string;
}

export function StatCard({ title, value, iconName, color }: StatCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

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
      <View style={styles.cardHeader}>
        <IconSymbol name={iconName} size={22} color={color} />
        <ThemedText
          type="defaultSemiBold"
          style={[styles.cardTitle, { color: colors.text }]}
        >
          {title}
        </ThemedText>
      </View>
      <ThemedText type="title" style={[styles.calorieNumber, { color }]}>
        {value}
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.calorieLabel, { color: colors.textSecondary }]}
      >
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
    borderWidth: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
  },
  calorieNumber: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  calorieLabel: {
    fontSize: 12,
  },
});
