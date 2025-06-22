import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface Category {
  key: "all" | "food" | "drink" | "snack";
  label: string;
  icon: any;
}

interface CategoryFilterProps {
  selectedCategory: "all" | "food" | "drink" | "snack";
  onSelectCategory: (category: "all" | "food" | "drink" | "snack") => void;
  visible?: boolean;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  visible = true,
}: CategoryFilterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const categories: Category[] = [
    { key: "all", label: "All", icon: "list.bullet" },
    { key: "food", label: "Food", icon: "fork.knife" },
    { key: "drink", label: "Drinks", icon: "cup.and.saucer" },
    { key: "snack", label: "Snacks", icon: "circle.fill" },
  ];

  if (!visible) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => (
        <Pressable
          key={category.key}
          style={[
            styles.categoryButton,
            {
              backgroundColor:
                selectedCategory === category.key
                  ? colors.tint
                  : colors.backgroundSecondary,
              borderColor:
                selectedCategory === category.key
                  ? colors.tint
                  : colors.separator,
            },
          ]}
          onPress={() => onSelectCategory(category.key)}
        >
          <IconSymbol
            name={category.icon}
            size={14}
            color={selectedCategory === category.key ? "white" : colors.icon}
          />
          <ThemedText
            type="default"
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === category.key ? "white" : colors.text,
              },
            ]}
          >
            {category.label}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
