import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useApp } from "@/contexts/AppContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function FavoritesScreen() {
  const { state } = useApp();
  const { favorites, loading } = state;

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading favorites...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Favorites</ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Quick add your favorite foods
        </ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        {favorites.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="subtitle">No favorites yet</ThemedText>
            <ThemedText type="default" style={styles.emptyText}>
              Add foods to favorites from the Add Food tab
            </ThemedText>
          </ThemedView>
        ) : (
          favorites.map((item) => (
            <ThemedView key={item.id} style={styles.favoriteItem}>
              <ThemedView style={styles.itemHeader}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                <ThemedText type="default" style={styles.calories}>
                  {item.caloriesPerServing} cal
                </ThemedText>
              </ThemedView>
              <ThemedText type="default" style={styles.servingSize}>
                {item.servingSize} • {item.category}
              </ThemedText>
            </ThemedView>
          ))
        )}
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
  emptyState: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  favoriteItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  calories: {
    fontWeight: "600",
  },
  servingSize: {
    opacity: 0.7,
    fontSize: 14,
  },
});
