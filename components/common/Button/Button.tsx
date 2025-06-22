import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "destructive";
  size?: "small" | "medium" | "large";
}

export function Button({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  size = "medium",
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getBackgroundColor = () => {
    if (disabled) return colors.backgroundSecondary;
    switch (variant) {
      case "primary":
        return colors.tint;
      case "secondary":
        return colors.cardBackground;
      case "destructive":
        return colors.error || "#FF3B30";
      default:
        return colors.tint;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case "primary":
        return "white";
      case "secondary":
        return colors.text;
      case "destructive":
        return "white";
      default:
        return "white";
    }
  };

  return (
    <Pressable
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor: getBackgroundColor(),
          borderColor:
            variant === "secondary" ? colors.separator : "transparent",
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText
        style={[styles.text, styles[`${size}Text`], { color: getTextColor() }]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
