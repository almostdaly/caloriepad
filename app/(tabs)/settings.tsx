import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const { state } = useApp();
  const { settings } = state;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Check if we're in development mode
  const isDevelopment =
    __DEV__ || Constants.manifest?.releaseChannel === undefined;

  const handleDeveloperModePress = () => {
    router.push("/developer");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText
          type="default"
          style={[styles.subtitle, { color: colors.textSecondary }]}
        >
          Customize your CaloriePad experience
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Settings
          </ThemedText>

          <ThemedView
            style={[
              styles.settingItem,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <ThemedText type="default" style={{ color: colors.text }}>
              Daily Calorie Goal
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>
              {settings.dailyCalorieGoal} cal
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.settingItem,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <ThemedText type="default" style={{ color: colors.text }}>
              Theme
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>
              {settings.theme}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.settingItem,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <ThemedText type="default" style={{ color: colors.text }}>
              HealthKit Integration
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>
              {settings.healthKitEnabled ? "Enabled" : "Disabled"}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.settingItem,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <ThemedText type="default" style={{ color: colors.text }}>
              Notifications
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={{ color: colors.text }}>
              {settings.notifications ? "On" : "Off"}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Developer Mode Section - Only in Development */}
        {isDevelopment && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Developer Tools
            </ThemedText>
            <Pressable
              style={[
                styles.developerButton,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: "#FF9500",
                },
              ]}
              onPress={handleDeveloperModePress}
            >
              <ThemedView
                style={[
                  styles.developerButtonContent,
                  { backgroundColor: "transparent" },
                ]}
              >
                <ThemedText type="defaultSemiBold" style={{ color: "#FF9500" }}>
                  🛠 Developer Mode
                </ThemedText>
                <ThemedText
                  type="default"
                  style={[
                    { color: colors.textSecondary },
                    styles.developerSubtitle,
                  ]}
                >
                  Access debugging tools and reset functions
                </ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
        )}

        <ThemedView style={styles.comingSoon}>
          <ThemedText
            type="default"
            style={[styles.comingSoonText, { color: colors.textSecondary }]}
          >
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
    borderWidth: 1,
  },
  developerButton: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
  },
  developerButtonContent: {
    padding: 16,
    minHeight: 60,
    justifyContent: "center",
  },
  developerSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  comingSoon: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 40,
  },
  comingSoonText: {
    textAlign: "center",
  },
});
