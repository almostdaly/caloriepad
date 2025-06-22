import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodEntry } from "@/types";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

interface TodayEntriesListProps {
  entries: FoodEntry[];
  onViewAll?: () => void;
}

export function TodayEntriesList({
  entries,
  onViewAll,
}: TodayEntriesListProps) {
  const colorScheme = useColorScheme();

  if (entries.length === 0) {
    return (
      <ThemedView style={styles.entriesSection}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Today&apos;s Entries</ThemedText>
          <ThemedText type="default" style={styles.entriesCount}>
            0 entries
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.emptyState}>
          <IconSymbol
            name="plus.circle"
            size={32}
            color={Colors[colorScheme ?? "light"].icon}
          />
          <ThemedText type="default" style={styles.emptyText}>
            No entries yet today
          </ThemedText>
          <ThemedText type="default" style={styles.emptySubtext}>
            Tap &quot;Add Food&quot; to get started
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.entriesSection}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText type="subtitle">Today&apos;s Entries</ThemedText>
        <ThemedText type="default" style={styles.entriesCount}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </ThemedText>
      </ThemedView>

      <ThemedView>
        {entries.slice(0, 5).map((entry) => (
          <ThemedView
            key={entry.id}
            style={[
              styles.entryItem,
              {
                backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
              },
            ]}
          >
            <ThemedView style={styles.entryHeader}>
              <ThemedText type="defaultSemiBold">
                {entry.foodItem.name}
              </ThemedText>
              <ThemedText type="default" style={styles.entryCalories}>
                {entry.totalCalories} cal
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.entryDetails}>
              <ThemedText type="default" style={styles.entryMeta}>
                {entry.quantity}x {entry.foodItem.servingSize} •{" "}
                {entry.foodItem.category}
              </ThemedText>
              <ThemedText type="default" style={styles.entryTime}>
                {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}

        {entries.length > 5 && onViewAll && (
          <Pressable style={styles.viewAllButton} onPress={onViewAll}>
            <ThemedText type="default" style={styles.viewAllText}>
              View all {entries.length} entries
            </ThemedText>
            <IconSymbol
              name="chevron.right"
              size={16}
              color={Colors[colorScheme ?? "light"].icon}
            />
          </Pressable>
        )}
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
    opacity: 0.7,
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  emptySubtext: {
    marginTop: 4,
    opacity: 0.7,
    textAlign: "center",
  },
  entryItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    opacity: 0.7,
  },
  entryTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  viewAllText: {
    opacity: 0.7,
  },
});
