import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActivityIndicator } from "react-native";
import OnboardingScreen from "./onboarding";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { state } = useApp();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Show loading while app initializes
  if (state.loading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  // Show onboarding if user hasn't completed it
  if (!state.onboardingStatus.hasOnboarded) {
    return <OnboardingScreen />;
  }

  // Show main app
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Create custom theme based on our color system
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.tint,
      background: Colors.dark.background,
      card: Colors.dark.cardBackground,
      text: Colors.dark.text,
      border: Colors.dark.cardBorder,
      notification: Colors.dark.tint,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.tint,
      background: Colors.light.background,
      card: Colors.light.cardBackground,
      text: Colors.light.text,
      border: Colors.light.cardBorder,
      notification: Colors.light.tint,
    },
  };

  return (
    <AppProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? customDarkTheme : customLightTheme}
      >
        <AppContent />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </AppProvider>
  );
}
