import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet } from "react-native";

interface TotalDisplayProps {
  totalCalories: number;
}

export function TotalDisplay({ totalCalories }: TotalDisplayProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark" ? colors.backgroundSecondary : "transparent",
          borderColor: colors.separator,
        },
      ]}
    >
      <ThemedText
        type="default"
        style={[styles.label, { color: colors.textSecondary }]}
      >
        Total
      </ThemedText>

      <ThemedView style={[styles.display, { backgroundColor: "transparent" }]}>
        <ThemedText type="title" style={[styles.value, { color: colors.tint }]}>
          {totalCalories}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  display: {
    alignItems: "center",
    gap: 2,
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
  },
});
