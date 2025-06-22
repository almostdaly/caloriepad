import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet, TextInput } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder = "Enter food name...",
}: SearchInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.separator,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="done"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable
          style={[
            styles.clearButton,
            {
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
          onPress={onClear}
        >
          <IconSymbol name="xmark" size={12} color={colors.icon} />
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
