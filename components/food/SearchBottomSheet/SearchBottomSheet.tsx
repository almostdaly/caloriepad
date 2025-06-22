import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodItem } from "@/types";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface SearchBottomSheetProps {
  visible: boolean;
  currentFood: string;
  suggestions: FoodItem[];
  isLoading: boolean;
  onSelectSuggestion: (food: FoodItem) => void;
  onSelectCustom: () => void;
  onClose: () => void;
}

export function SearchBottomSheet({
  visible,
  currentFood,
  suggestions,
  isLoading,
  onSelectSuggestion,
  onSelectCustom,
  onClose,
}: SearchBottomSheetProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
              backgroundColor: "rgba(0, 0, 0, 1)",
            },
          ]}
        >
          <Pressable style={styles.backdropPressable} onPress={onClose} />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
              backgroundColor: colors.background,
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View
              style={[styles.handle, { backgroundColor: colors.textSecondary }]}
            />
          </View>

          {/* Header */}
          <ThemedView
            style={[styles.header, { backgroundColor: "transparent" }]}
          >
            <ThemedText type="subtitle" style={{ color: colors.text }}>
              Search Results
            </ThemedText>
            <Pressable
              style={[
                styles.closeButton,
                { backgroundColor: colors.backgroundSecondary },
              ]}
              onPress={onClose}
            >
              <IconSymbol name="xmark" size={16} color={colors.textSecondary} />
            </Pressable>
          </ThemedView>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <ThemedView
                style={[
                  styles.loadingContainer,
                  { backgroundColor: "transparent" },
                ]}
              >
                <ThemedText style={{ color: colors.textSecondary }}>
                  Searching...
                </ThemedText>
              </ThemedView>
            ) : (
              <>
                {suggestions.map((food, index) => (
                  <Pressable
                    key={food.id}
                    style={[
                      styles.suggestionItem,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.separator,
                      },
                    ]}
                    onPress={() => onSelectSuggestion(food)}
                  >
                    <ThemedView
                      style={[
                        styles.suggestionContent,
                        { backgroundColor: "transparent" },
                      ]}
                    >
                      <ThemedText
                        style={[styles.suggestionName, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {food.name}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.suggestionCalories,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {food.caloriesPerServing} cal
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                ))}

                {/* Custom food option */}
                <Pressable
                  style={[
                    styles.suggestionItem,
                    styles.customSuggestion,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderColor: colors.tint,
                    },
                  ]}
                  onPress={onSelectCustom}
                >
                  <ThemedView
                    style={[
                      styles.suggestionContent,
                      { backgroundColor: "transparent" },
                    ]}
                  >
                    <IconSymbol
                      name="plus.circle"
                      size={20}
                      color={colors.tint}
                    />
                    <ThemedText
                      style={[styles.customText, { color: colors.tint }]}
                    >
                      Add &quot;{currentFood}&quot; as custom food
                    </ThemedText>
                  </ThemedView>
                </Pressable>
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropPressable: {
    flex: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
    height: Dimensions.get("window").height,
    paddingTop: 60, // Extra padding for status bar
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  suggestionItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  suggestionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  suggestionCalories: {
    fontSize: 14,
    fontWeight: "500",
  },
  customSuggestion: {
    marginTop: 8,
    borderWidth: 2,
  },
  customText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
});
