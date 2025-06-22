import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StorageService } from "@/services/storage";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

interface StorageStats {
  totalKeys: number;
  approximateSize: number;
  keysByCategory: Record<string, number>;
}

export default function DeveloperScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { refreshData, developerTools } = useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    try {
      const stats = await StorageService.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error("Error loading storage stats:", error);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const showConfirmAlert = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  };

  const handleResetTodayLog = () => {
    showConfirmAlert(
      "Reset Today's Log",
      "This will delete all food entries for today. This action cannot be undone.",
      async () => {
        try {
          setLoading("resetToday");
          await developerTools.resetTodayLog();
          Alert.alert("Success", "Today's log has been reset.");
          await loadStorageStats();
        } catch (error) {
          Alert.alert("Error", "Failed to reset today's log.");
        } finally {
          setLoading(null);
        }
      }
    );
  };

  const handleResetCustomFoodData = () => {
    showConfirmAlert(
      "Reset Custom Food Data",
      "This will delete all custom foods and favorites. Built-in foods will be restored. This action cannot be undone.",
      async () => {
        try {
          setLoading("resetFood");
          await developerTools.resetCustomFoodData();
          Alert.alert("Success", "Custom food data has been reset.");
          await loadStorageStats();
        } catch (error) {
          Alert.alert("Error", "Failed to reset custom food data.");
        } finally {
          setLoading(null);
        }
      }
    );
  };

  const handleFactoryReset = () => {
    showConfirmAlert(
      "Factory Reset",
      "⚠️ WARNING: This will delete ALL app data including settings, food entries, favorites, and health permissions. You will need to re-grant health permissions and go through onboarding again. This action cannot be undone.",
      async () => {
        try {
          setLoading("factoryReset");
          await developerTools.factoryReset();
          Alert.alert(
            "Factory Reset Complete",
            "All data has been cleared. The app will restart.",
            [
              {
                text: "OK",
                onPress: () => {
                  router.replace("/");
                },
              },
            ]
          );
        } catch (error) {
          Alert.alert("Error", "Failed to perform factory reset.");
        } finally {
          setLoading(null);
        }
      }
    );
  };

  const SettingsRow = ({
    title,
    subtitle,
    onPress,
    destructive = false,
    loading: rowLoading = false,
    isLast = false,
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    destructive?: boolean;
    loading?: boolean;
    isLast?: boolean;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed
            ? colors.backgroundSecondary
            : colors.cardBackground,
        },
      ]}
      onPress={onPress}
      disabled={rowLoading}
    >
      <ThemedView
        style={[styles.rowContent, { backgroundColor: "transparent" }]}
      >
        <ThemedView
          style={[styles.rowText, { backgroundColor: "transparent" }]}
        >
          <ThemedText
            style={[
              styles.rowTitle,
              {
                color: destructive ? colors.error : colors.text,
              },
            ]}
          >
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText
              style={[styles.rowSubtitle, { color: colors.textSecondary }]}
            >
              {subtitle}
            </ThemedText>
          )}
        </ThemedView>
        <ThemedView
          style={[styles.rowAccessory, { backgroundColor: "transparent" }]}
        >
          {rowLoading && (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          )}
        </ThemedView>
      </ThemedView>
      {!isLast && (
        <ThemedView
          style={[
            styles.separator,
            {
              backgroundColor: colors.separator,
            },
          ]}
        />
      )}
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Developer Mode",
          headerBackTitle: "Settings",
        }}
      />
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Storage Statistics */}
          <ThemedView style={styles.section}>
            <ThemedText
              style={[styles.sectionHeader, { color: colors.textSecondary }]}
            >
              Storage Statistics
            </ThemedText>
            <ThemedView
              style={[
                styles.sectionContent,
                {
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
              <SettingsRow
                title="Total Keys"
                subtitle={storageStats?.totalKeys.toString() || "0"}
              />
              <SettingsRow
                title="Storage Size"
                subtitle={
                  storageStats
                    ? formatBytes(storageStats.approximateSize)
                    : "0 B"
                }
              />
              {storageStats &&
                Object.entries(storageStats.keysByCategory).map(
                  ([category, count], index, array) => (
                    <SettingsRow
                      key={category}
                      title={
                        category.charAt(0).toUpperCase() + category.slice(1)
                      }
                      subtitle={count.toString()}
                      isLast={index === array.length - 1}
                    />
                  )
                )}
            </ThemedView>
          </ThemedView>

          {/* Reset Functions */}
          <ThemedView style={styles.section}>
            <ThemedText
              style={[styles.sectionHeader, { color: colors.textSecondary }]}
            >
              Reset Functions
            </ThemedText>
            <ThemedView
              style={[
                styles.sectionContent,
                {
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
              <SettingsRow
                title="Reset Today's Log"
                onPress={handleResetTodayLog}
                loading={loading === "resetToday"}
              />
              <SettingsRow
                title="Reset Custom Food Data"
                onPress={handleResetCustomFoodData}
                loading={loading === "resetFood"}
              />
              <SettingsRow
                title="Factory Reset"
                onPress={handleFactoryReset}
                destructive
                loading={loading === "factoryReset"}
                isLast
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
  },
  sectionContent: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  row: {
    minHeight: 44,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 22,
  },
  rowSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 2,
  },
  rowAccessory: {
    marginLeft: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});
