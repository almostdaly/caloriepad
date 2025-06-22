import { IconSymbol } from "@/components/ui/IconSymbol";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import { Animated, Modal, StyleSheet } from "react-native";

interface SuccessOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export function SuccessOverlay({ visible, onComplete }: SuccessOverlayProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animate overlay fade in
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Animate checkmark scale in with spring
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }).start();

      // Auto dismiss and navigate after 1.2 seconds
      setTimeout(() => {
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Reset animation values for next time
          overlayOpacity.setValue(0);
          checkScale.setValue(0);
          onComplete();
        });
      }, 1200);
    }
  }, [visible, overlayOpacity, checkScale, onComplete]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Animated.View
          style={[
            styles.checkContainer,
            { transform: [{ scale: checkScale }] },
          ]}
        >
          <IconSymbol name="checkmark" size={50} color="white" />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#34C759", // iOS green
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
