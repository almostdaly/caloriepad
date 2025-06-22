import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useApp } from "@/contexts/AppContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HealthService } from "@/services/healthService";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconColor: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to CaloriePad",
    description:
      "Track your daily calorie intake with a simple, beautiful interface designed for effortless food logging.",
    iconName: "heart.fill",
    iconColor: "#FF6B6B",
  },
  {
    id: "health",
    title: "Connect Apple Health",
    description:
      "We'll request access to your activity data to calculate calories burned and show your net calorie balance.",
    iconName: "heart.text.square",
    iconColor: "#4ECDC4",
  },
  {
    id: "privacy",
    title: "Your Privacy Matters",
    description:
      "All your data stays on your device. We never share or upload your personal information.",
    iconName: "lock.shield",
    iconColor: "#45B7D1",
  },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { updateOnboardingStatus } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleRequestHealthPermissions();
    }
  };

  const handleSkip = () => {
    handleCompleteOnboarding(false);
  };

  const handleRequestHealthPermissions = async () => {
    setIsRequestingPermissions(true);

    try {
      if (HealthService.isHealthKitAvailable()) {
        const permissions = await HealthService.requestPermissions();
        const hasPermissions = Object.values(permissions).some(
          (granted) => granted
        );

        await handleCompleteOnboarding(hasPermissions);
      } else {
        Alert.alert(
          "HealthKit Not Available",
          "HealthKit is not available on this device. You can still use CaloriePad to track your food intake.",
          [
            {
              text: "Continue",
              onPress: () => handleCompleteOnboarding(false),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting health permissions:", error);
      Alert.alert(
        "Permission Error",
        "There was an issue requesting health permissions. You can enable them later in Settings.",
        [
          {
            text: "Continue",
            onPress: () => handleCompleteOnboarding(false),
          },
        ]
      );
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  const handleCompleteOnboarding = async (
    healthPermissionsGranted: boolean
  ) => {
    try {
      await updateOnboardingStatus({
        hasOnboarded: true,
        healthPermissionsRequested: true,
        healthPermissionsGranted,
        onboardingCompletedAt: new Date(),
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert("Error", "Failed to complete onboarding. Please try again.");
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: "transparent" }]}>
          <ThemedText
            type="title"
            style={[styles.appTitle, { color: colors.text }]}
          >
            CaloriePad
          </ThemedText>
          <ThemedText
            type="default"
            style={[styles.appSubtitle, { color: colors.textSecondary }]}
          >
            Simple calorie tracking
          </ThemedText>
        </ThemedView>

        {/* Progress Indicator */}
        <ThemedView
          style={[styles.progressContainer, { backgroundColor: "transparent" }]}
        >
          {ONBOARDING_STEPS.map((_, index) => (
            <ThemedView
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index <= currentStep ? colors.tint : colors.separator,
                },
              ]}
            />
          ))}
        </ThemedView>

        {/* Main Content */}
        <ThemedView
          style={[styles.content, { backgroundColor: "transparent" }]}
        >
          <ThemedView
            style={[styles.iconContainer, { backgroundColor: "transparent" }]}
          >
            <IconSymbol
              name={step.iconName as any}
              size={80}
              color={step.iconColor}
            />
          </ThemedView>

          <ThemedText
            type="title"
            style={[styles.stepTitle, { color: colors.text }]}
          >
            {step.title}
          </ThemedText>

          <ThemedText
            type="default"
            style={[styles.stepDescription, { color: colors.textSecondary }]}
          >
            {step.description}
          </ThemedText>

          {/* Special content for health step */}
          {step.id === "health" && (
            <ThemedView
              style={[
                styles.healthPermissions,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[styles.permissionTitle, { color: colors.text }]}
              >
                We'll request access to:
              </ThemedText>

              <ThemedView
                style={[
                  styles.permissionItem,
                  { backgroundColor: "transparent" },
                ]}
              >
                <IconSymbol
                  name="flame"
                  size={16}
                  color={colors.healthOrange}
                />
                <ThemedText
                  style={[
                    styles.permissionText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Active energy burned
                </ThemedText>
              </ThemedView>

              <ThemedView
                style={[
                  styles.permissionItem,
                  { backgroundColor: "transparent" },
                ]}
              >
                <IconSymbol name="heart" size={16} color={colors.healthRed} />
                <ThemedText
                  style={[
                    styles.permissionText,
                    { color: colors.textSecondary },
                  ]}
                >
                  Basic health metrics
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>

      {/* Footer */}
      <ThemedView style={[styles.footer, { backgroundColor: "transparent" }]}>
        <Pressable
          style={[styles.skipButton, { backgroundColor: "transparent" }]}
          onPress={handleSkip}
          disabled={isRequestingPermissions}
        >
          <ThemedText
            style={[styles.skipButtonText, { color: colors.textSecondary }]}
          >
            Skip
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.nextButton,
            {
              backgroundColor: colors.tint,
              opacity: isRequestingPermissions ? 0.7 : 1,
            },
          ]}
          onPress={handleNext}
          disabled={isRequestingPermissions}
        >
          {isRequestingPermissions ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ThemedText style={styles.nextButtonText}>
              {isLastStep ? "Get Started" : "Next"}
            </ThemedText>
          )}
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
  },
  appSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  healthPermissions: {
    alignItems: "flex-start",
    gap: 12,
  },
  permissionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  permissionText: {
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingBottom: 40,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    fontSize: 16,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
