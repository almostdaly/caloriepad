import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FoodService } from "@/services/foodService";
import { FoodEntry, FoodItem } from "@/types";
import {
  adjustValue,
  calculateTotalCalories,
  createDebouncer,
  searchFoodsWithDebounce,
} from "@/utils/foodUtils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput } from "react-native";
import { CalorieControls } from "../CalorieControls";
import { SearchBottomSheet } from "../SearchBottomSheet";
import { SearchInput } from "../SearchInput";
import { SuccessOverlay } from "../SuccessOverlay";
import { TotalDisplay } from "../TotalDisplay";

interface QuickAddFoodProps {
  onFoodAdded: () => void;
  addFoodEntry: (entry: FoodEntry) => Promise<void>;
}

export function QuickAddFood({ onFoodAdded, addFoodEntry }: QuickAddFoodProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const searchInputRef = useRef<TextInput>(null);

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isAcceptedSuggestion, setIsAcceptedSuggestion] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncer = createDebouncer();

  const performSearch = useCallback(
    async (query: string) => {
      if (query.trim().length > 2 && !isAcceptedSuggestion) {
        setIsSearching(true);
        setShowSearchModal(true);
        await searchFoodsWithDebounce(
          query,
          (results) => {
            setSearchResults(results);
            setIsSearching(false);
          },
          () => {
            setSearchResults([]);
            setIsSearching(false);
          }
        );
      } else {
        setSearchResults([]);
        setShowSearchModal(false);
        setIsSearching(false);
      }
    },
    [isAcceptedSuggestion]
  );

  useEffect(() => {
    debouncer.debounce(() => performSearch(foodName), 500);
    return () => debouncer.clear();
  }, [foodName, performSearch]);

  const handleFoodNameChange = (text: string) => {
    setFoodName(text);
    if (isAcceptedSuggestion) {
      setIsAcceptedSuggestion(false);
    }
  };

  const handleClearFoodName = () => {
    setFoodName("");
    setIsAcceptedSuggestion(false);
    setShowSearchModal(false);
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSelectSuggestion = (food: FoodItem) => {
    setFoodName(food.name);
    setCalories(food.caloriesPerServing);
    setIsAcceptedSuggestion(true);
    setShowSearchModal(false);
    setSearchResults([]);
  };

  const handleSelectCustom = () => {
    setIsAcceptedSuggestion(true);
    setShowSearchModal(false);
    setSearchResults([]);
  };

  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
  };

  const handleCalorieChange = (amount: number) => {
    setCalories(adjustValue(calories, amount, 0));
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(adjustValue(quantity, amount, 1));
  };

  const handleSuccessComplete = () => {
    setShowSuccessOverlay(false);
    // Blur the search input to prevent auto-focus
    searchInputRef.current?.blur();
  };

  const handleQuickAdd = async () => {
    if (!foodName.trim()) {
      Alert.alert("Missing Name", "Please enter a food name.");
      return;
    }

    try {
      const existingFood = searchResults.find(
        (f) => f.name.toLowerCase() === foodName.toLowerCase()
      );

      let foodToSave: FoodItem;

      if (existingFood) {
        if (
          existingFood.isUSDAFood &&
          calories !== existingFood.caloriesPerServing
        ) {
          foodToSave = { ...existingFood, caloriesPerServing: calories };
        } else if (
          !existingFood.isUSDAFood &&
          calories !== existingFood.caloriesPerServing
        ) {
          foodToSave = { ...existingFood, caloriesPerServing: calories };
          await FoodService.updateFood(foodToSave);
        } else {
          foodToSave = existingFood;
        }
      } else {
        foodToSave = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: foodName.trim(),
          caloriesPerServing: calories,
          servingSize: "1 serving",
          category: "food",
          isFavorite: false,
          createdAt: new Date(),
          isUSDAFood: false,
        };
        await FoodService.addCustomFood(foodToSave);
      }

      const entry: FoodEntry = {
        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        foodItem: foodToSave,
        quantity,
        totalCalories: calculateTotalCalories(calories, quantity),
        timestamp: new Date(),
      };

      await addFoodEntry(entry);
      onFoodAdded();

      // Blur input before resetting to prevent auto-focus
      searchInputRef.current?.blur();

      // Reset form
      setFoodName("");
      setCalories(100);
      setQuantity(1);
      setIsAcceptedSuggestion(false);
      setSearchResults([]);
      setShowSearchModal(false);

      // Show success animation
      setShowSuccessOverlay(true);
    } catch (error) {
      console.error("Error adding food:", error);
      Alert.alert("Error", "Failed to add food entry. Please try again.");
    }
  };

  const totalCalories = calculateTotalCalories(calories, quantity);

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.separator,
        },
      ]}
    >
      <ThemedView style={[styles.header, { backgroundColor: "transparent" }]}>
        <IconSymbol name="plus.circle" size={18} color={colors.tint} />
        <ThemedText
          type="defaultSemiBold"
          style={[styles.title, { color: colors.text }]}
        >
          Quick Add Food
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.form, { backgroundColor: "transparent" }]}>
        <ThemedView
          style={[styles.inputContainer, { backgroundColor: "transparent" }]}
        >
          <SearchInput
            ref={searchInputRef}
            value={foodName}
            onChangeText={handleFoodNameChange}
            onClear={handleClearFoodName}
            placeholder="Enter food name..."
            isLoading={isSearching}
          />
        </ThemedView>

        <ThemedView
          style={[styles.panelsContainer, { backgroundColor: "transparent" }]}
        >
          <CalorieControls
            calories={calories}
            quantity={quantity}
            onCalorieChange={handleCalorieChange}
            onQuantityChange={handleQuantityChange}
          />
          <TotalDisplay totalCalories={totalCalories} />
        </ThemedView>

        <Pressable
          style={[
            styles.addButton,
            {
              backgroundColor: colors.tint,
            },
            !foodName.trim() && styles.addButtonDisabled,
          ]}
          onPress={handleQuickAdd}
          disabled={!foodName.trim()}
        >
          <ThemedText style={styles.addButtonText}>Add to Today</ThemedText>
        </Pressable>
      </ThemedView>

      <SearchBottomSheet
        visible={showSearchModal}
        currentFood={foodName}
        suggestions={searchResults}
        isLoading={isSearching}
        onSelectSuggestion={handleSelectSuggestion}
        onSelectCustom={handleSelectCustom}
        onClose={handleCloseSearchModal}
      />

      <SuccessOverlay
        visible={showSuccessOverlay}
        onComplete={handleSuccessComplete}
      />
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
  panelsContainer: {
    flexDirection: "row",
    gap: 12,
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
