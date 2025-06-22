import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodService } from "@/services/foodService";
import { FoodEntry, FoodItem } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

interface QuickAddFoodProps {
  onFoodAdded: () => void;
  addFoodEntry: (entry: FoodEntry) => Promise<void>;
}

export function QuickAddFood({ onFoodAdded, addFoodEntry }: QuickAddFoodProps) {
  const colorScheme = useColorScheme();
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const searchFoods = async () => {
      try {
        const results = await FoodService.searchFoods(foodName);
        setSearchResults(results.slice(0, 3)); // Show only top 3 results
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Error searching foods:", error);
        setSearchResults([]);
        setShowSuggestions(false);
      }
    };

    if (foodName.trim().length > 1) {
      searchFoods();
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [foodName]);

  const selectSuggestion = (food: FoodItem) => {
    setFoodName(food.name);
    setCalories(food.caloriesPerServing);

    // Properly hide suggestions
    setShowSuggestions(false);
    setSearchResults([]);

    // Clear the search state completely
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const adjustCalories = (amount: number) => {
    const newCalories = Math.max(0, calories + amount);
    setCalories(newCalories);
  };

  const adjustQuantity = (amount: number) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleQuickAdd = async () => {
    if (!foodName.trim()) {
      Alert.alert("Missing Name", "Please enter a food name.");
      return;
    }

    try {
      // Check if this is a modified version of an existing food or completely new
      const existingFood = searchResults.find(
        (f) => f.name.toLowerCase() === foodName.toLowerCase()
      );

      let foodToSave: FoodItem;

      if (existingFood && calories !== existingFood.caloriesPerServing) {
        // User modified calories of existing food - update the personal database
        foodToSave = { ...existingFood, caloriesPerServing: calories };
        await FoodService.updateFood(foodToSave);
      } else if (!existingFood) {
        // Completely new food - add to personal database
        foodToSave = {
          id: `custom-${Date.now()}`,
          name: foodName.trim(),
          caloriesPerServing: calories,
          servingSize: "1 serving",
          category: "food",
          isFavorite: false,
          createdAt: new Date(),
        };
        await FoodService.addCustomFood(foodToSave);
      } else {
        // Using existing food as-is
        foodToSave = existingFood;
      }

      const totalCalories = calories * quantity;
      const entry: FoodEntry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        foodItem: foodToSave,
        quantity: quantity,
        totalCalories: totalCalories,
        timestamp: new Date(),
      };

      await addFoodEntry(entry);

      // Reset form
      setFoodName("");
      setCalories(100);
      setQuantity(1);
      setShowSuggestions(false);
      setSearchResults([]);

      onFoodAdded();

      Alert.alert(
        "Added!",
        `${foodToSave.name} (${quantity}x ${calories} cal = ${totalCalories} cal) has been added to your daily log.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error adding quick food:", error);
      Alert.alert("Error", "Failed to add food entry. Please try again.");
    }
  };

  const colors = Colors[colorScheme ?? "light"];
  const totalCalories = calories * quantity;

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark" ? colors.cardBackground : "transparent",
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <ThemedView style={[styles.header, { backgroundColor: "transparent" }]}>
        <IconSymbol name="plus.circle.fill" size={20} color={colors.tint} />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Quick Add
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.form, { backgroundColor: "transparent" }]}>
        <ThemedView
          style={[styles.inputContainer, { backgroundColor: "transparent" }]}
        >
          <TextInput
            style={[
              styles.nameInput,
              {
                color: colors.text,
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.separator,
              },
            ]}
            placeholder="Food name (start typing to search)..."
            placeholderTextColor={colors.icon}
            value={foodName}
            onChangeText={setFoodName}
            returnKeyType="done"
            onBlur={() => {
              // Hide suggestions when input loses focus
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />

          {showSuggestions && (
            <ThemedView
              style={[
                styles.suggestionsContainer,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.separator,
                  shadowColor: colors.text,
                  shadowOpacity: 0.1,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              <ScrollView
                style={styles.suggestions}
                keyboardShouldPersistTaps="handled"
              >
                {searchResults.map((food) => (
                  <Pressable
                    key={food.id}
                    style={[
                      styles.suggestion,
                      { borderBottomColor: colors.separator },
                    ]}
                    onPress={() => selectSuggestion(food)}
                  >
                    <ThemedText type="default">{food.name}</ThemedText>
                    <ThemedText
                      type="default"
                      style={[
                        styles.suggestionCalories,
                        { color: colors.tint },
                      ]}
                    >
                      {food.caloriesPerServing} cal
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </ThemedView>
          )}
        </ThemedView>

        {/* Two-Panel Layout */}
        <ThemedView
          style={[styles.panelsContainer, { backgroundColor: "transparent" }]}
        >
          {/* Left Panel - Controls */}
          <ThemedView
            style={[
              styles.controlsPanel,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? colors.backgroundSecondary
                    : "transparent",
                borderColor: colors.separator,
              },
            ]}
          >
            <ThemedText
              type="default"
              style={[styles.panelLabel, { color: colors.textSecondary }]}
            >
              Adjust
            </ThemedText>

            {/* Calories Control */}
            <ThemedView
              style={[styles.controlRow, { backgroundColor: "transparent" }]}
            >
              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.separator,
                  },
                ]}
                onPress={() => adjustCalories(-50)}
              >
                <IconSymbol name="minus" size={14} color={colors.text} />
              </Pressable>

              <ThemedView
                style={[
                  styles.controlValue,
                  { backgroundColor: "transparent" },
                ]}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.valueText, { color: colors.tint }]}
                >
                  {calories}
                </ThemedText>
              </ThemedView>

              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.separator,
                  },
                ]}
                onPress={() => adjustCalories(50)}
              >
                <IconSymbol name="plus" size={14} color={colors.text} />
              </Pressable>
            </ThemedView>

            {/* Servings Control */}
            <ThemedView
              style={[styles.controlRow, { backgroundColor: "transparent" }]}
            >
              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.separator,
                  },
                ]}
                onPress={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
              >
                <IconSymbol
                  name="minus"
                  size={14}
                  color={quantity <= 1 ? colors.icon : colors.text}
                />
              </Pressable>

              <ThemedView
                style={[
                  styles.controlValue,
                  { backgroundColor: "transparent" },
                ]}
              >
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.valueText, { color: colors.text }]}
                >
                  {quantity}
                </ThemedText>
              </ThemedView>

              <Pressable
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.separator,
                  },
                ]}
                onPress={() => adjustQuantity(1)}
              >
                <IconSymbol name="plus" size={14} color={colors.text} />
              </Pressable>
            </ThemedView>
          </ThemedView>

          {/* Right Panel - Total Calculator */}
          <ThemedView
            style={[
              styles.totalPanel,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? colors.backgroundSecondary
                    : "transparent",
                borderColor: colors.separator,
              },
            ]}
          >
            <ThemedText
              type="default"
              style={[styles.panelLabel, { color: colors.textSecondary }]}
            >
              Total
            </ThemedText>

            <ThemedView
              style={[styles.totalDisplay, { backgroundColor: "transparent" }]}
            >
              <ThemedText
                type="title"
                style={[styles.totalValue, { color: colors.tint }]}
              >
                {totalCalories}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <Pressable
          style={[
            styles.addButton,
            { backgroundColor: colors.tint },
            !foodName.trim() && styles.addButtonDisabled,
          ]}
          onPress={handleQuickAdd}
          disabled={!foodName.trim()}
        >
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            Add to Daily Log
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 16,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    position: "relative",
  },
  nameInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 120,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1000,
  },
  suggestions: {
    flex: 1,
  },
  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  suggestionCalories: {
    fontSize: 14,
    fontWeight: "500",
  },
  panelsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  controlsPanel: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    gap: 12,
  },
  totalPanel: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
  controlValue: {
    alignItems: "center",
    flex: 1,
  },
  valueText: {
    fontSize: 18,
  },
  totalDisplay: {
    alignItems: "center",
    gap: 2,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  addButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
});
