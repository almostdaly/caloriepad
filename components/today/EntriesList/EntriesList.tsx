import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodEntry } from "@/types";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface TodayEntriesListProps {
  entries: FoodEntry[];
  onViewAll?: () => void;
  onNavigateToAdd?: () => void;
}

export function EntriesList({
  entries,
  onViewAll,
  onNavigateToAdd,
}: TodayEntriesListProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  if (entries.length === 0) {
    return (
      <ThemedView
        style={[styles.entriesSection, { backgroundColor: "transparent" }]}
      >
        <ThemedView
          style={[styles.sectionHeader, { backgroundColor: "transparent" }]}
        >
          <ThemedText type="subtitle">Today&apos;s Entries</ThemedText>
        </ThemedView>

        <Pressable
          style={[styles.emptyState, { backgroundColor: "transparent" }]}
          onPress={onNavigateToAdd}
        >
          <IconSymbol name="plus.circle" size={32} color={colors.tint} />
          <ThemedText
            type="default"
            style={[styles.emptyText, { color: colors.text }]}
          >
            Nothing added so far
          </ThemedText>
          <ThemedText
            type="default"
            style={[styles.emptySubtext, { color: colors.textSecondary }]}
          >
            Tap to add your first food
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.entriesSection, { backgroundColor: "transparent" }]}
    >
      <ThemedView
        style={[styles.sectionHeader, { backgroundColor: "transparent" }]}
      >
        <ThemedText type="subtitle">Today&apos;s Entries</ThemedText>
        {entries.length > 0 && onViewAll && (
          <Pressable
            style={[styles.viewAllButton, { backgroundColor: "transparent" }]}
            onPress={onViewAll}
          >
            <ThemedText
              type="default"
              style={[styles.viewAllText, { color: colors.textSecondary }]}
            >
              View all ({entries.length})
            </ThemedText>
            <IconSymbol name="chevron.right" size={16} color={colors.icon} />
          </Pressable>
        )}
      </ThemedView>

      <ThemedView style={{ backgroundColor: "transparent" }}>
        {entries.slice(0, 5).map((entry) => (
          <ThemedView
            key={entry.id}
            style={[
              styles.entryItem,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <ThemedView
              style={[styles.entryHeader, { backgroundColor: "transparent" }]}
            >
              <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>
                {entry.foodItem.name}
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.entryCalories, { color: colors.text }]}
              >
                {entry.totalCalories} cal
              </ThemedText>
            </ThemedView>
            <ThemedView
              style={[styles.entryDetails, { backgroundColor: "transparent" }]}
            >
              <ThemedText
                type="default"
                style={[styles.entryMeta, { color: colors.textSecondary }]}
              >
                {entry.foodItem.servingSize}
              </ThemedText>
              <ThemedText
                type="default"
                style={[styles.entryTime, { color: colors.textSecondary }]}
              >
                {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  entriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  entriesCount: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    marginTop: 4,
    textAlign: "center",
  },
  entryItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 0.5,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  entryCalories: {
    fontWeight: "600",
  },
  entryDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entryMeta: {
    fontSize: 14,
  },
  entryTime: {
    fontSize: 12,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  viewAllText: {
    // Remove opacity, use color directly
  },
});
