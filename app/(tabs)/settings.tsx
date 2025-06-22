import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useApp } from "@/contexts/AppContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { state } = useApp();
  const { settings } = state;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Customize your CaloriePad experience
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Settings
          </ThemedText>

          <ThemedView style={styles.settingItem}>
            <ThemedText type="default">Daily Calorie Goal</ThemedText>
            <ThemedText type="defaultSemiBold">
              {settings.dailyCalorieGoal} cal
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedText type="default">Theme</ThemedText>
            <ThemedText type="defaultSemiBold">{settings.theme}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedText type="default">HealthKit Integration</ThemedText>
            <ThemedText type="defaultSemiBold">
              {settings.healthKitEnabled ? "Enabled" : "Disabled"}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.settingItem}>
            <ThemedText type="default">Notifications</ThemedText>
            <ThemedText type="defaultSemiBold">
              {settings.notifications ? "On" : "Off"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.comingSoon}>
          <ThemedText type="default" style={styles.comingSoonText}>
            Settings editing functionality coming soon
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  comingSoon: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 40,
  },
  comingSoonText: {
    textAlign: "center",
    opacity: 0.7,
  },
});
