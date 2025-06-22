/**
 * CaloriePad color system with health-focused design
 * Using iOS system colors with custom health accent colors
 */

const healthGreen = "#30D158";
const healthOrange = "#FF9500";
const healthRed = "#FF3B30";
const healthBlue = "#007AFF";

export const Colors = {
  light: {
    // Text colors
    text: "#000000",
    textSecondary: "#6D6D70",
    textTertiary: "#999999",

    // Background colors
    background: "#FFFFFF",
    backgroundSecondary: "#F2F2F7",
    backgroundTertiary: "#FFFFFF",

    // Health colors
    healthGreen,
    healthOrange,
    healthRed,
    healthBlue,

    // UI colors
    tint: healthGreen,
    icon: "#8E8E93",
    separator: "#C6C6C8",
    overlay: "rgba(0, 0, 0, 0.4)",

    // Tab bar
    tabIconDefault: "#8E8E93",
    tabIconSelected: healthGreen,
    tabBarBackground: "#FFFFFF",

    // Cards and surfaces
    cardBackground: "#FFFFFF",
    cardBorder: "#E5E5EA",

    // Status colors
    success: healthGreen,
    warning: healthOrange,
    error: healthRed,
    info: healthBlue,
  },
  dark: {
    // Text colors
    text: "#FFFFFF",
    textSecondary: "#BCBCC4",
    textTertiary: "#BCBCC4",

    // Background colors
    background: "#000000",
    backgroundSecondary: "#1C1C1E",
    backgroundTertiary: "#2C2C2E",

    // Health colors
    healthGreen,
    healthOrange,
    healthRed,
    healthBlue,

    // UI colors
    tint: healthGreen,
    icon: "#8E8E93",
    separator: "#38383A",
    overlay: "rgba(0, 0, 0, 0.6)",

    // Tab bar
    tabIconDefault: "#8E8E93",
    tabIconSelected: healthGreen,
    tabBarBackground: "#000000",

    // Cards and surfaces
    cardBackground: "#1C1C1E",
    cardBorder: "#38383A",

    // Status colors
    success: healthGreen,
    warning: healthOrange,
    error: healthRed,
    info: healthBlue,
  },
};

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  return `${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}`;
};
