import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function AddFoodScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Add Food</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Search and add food to your daily log
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <ThemedView style={styles.comingSoon}>
          <ThemedText type="subtitle">Coming Soon</ThemedText>
          <ThemedText type="default" style={styles.comingSoonText}>
            Food search and adding functionality will be implemented next
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  comingSoon: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  comingSoonText: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
});
