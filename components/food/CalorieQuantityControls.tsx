import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface CalorieQuantityControlsProps {
  calories: number;
  quantity: number;
  onCalorieChange: (amount: number) => void;
  onQuantityChange: (amount: number) => void;
}

export function CalorieQuantityControls({
  calories,
  quantity,
  onCalorieChange,
  onQuantityChange,
}: CalorieQuantityControlsProps) {
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
        Adjust
      </ThemedText>

      {/* Calories Control */}
      <ThemedView
        style={[styles.controlRow, { backgroundColor: "transparent" }]}
      >
        <Pressable
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.separator,
            },
          ]}
          onPress={() => onCalorieChange(-50)}
        >
          <IconSymbol name="minus" size={14} color={colors.text} />
        </Pressable>

        <ThemedView
          style={[styles.controlValue, { backgroundColor: "transparent" }]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.valueText, { color: colors.tint }]}
          >
            {calories}
          </ThemedText>
        </ThemedView>

        <Pressable
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.separator,
            },
          ]}
          onPress={() => onCalorieChange(50)}
        >
          <IconSymbol name="plus" size={14} color={colors.text} />
        </Pressable>
      </ThemedView>

      {/* Quantity Control */}
      <ThemedView
        style={[styles.controlRow, { backgroundColor: "transparent" }]}
      >
        <Pressable
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.separator,
            },
          ]}
          onPress={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <IconSymbol
            name="minus"
            size={14}
            color={quantity <= 1 ? colors.icon : colors.text}
          />
        </Pressable>

        <ThemedView
          style={[styles.controlValue, { backgroundColor: "transparent" }]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.valueText, { color: colors.text }]}
          >
            {quantity}
          </ThemedText>
        </ThemedView>

        <Pressable
          style={[
            styles.controlButton,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.separator,
            },
          ]}
          onPress={() => onQuantityChange(1)}
        >
          <IconSymbol name="plus" size={14} color={colors.text} />
        </Pressable>
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
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
  controlValue: {
    alignItems: "center",
    flex: 1,
  },
  valueText: {
    fontSize: 18,
  },
});
