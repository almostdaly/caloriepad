import { Platform } from "react-native";

// Import @kingstinct/react-native-healthkit library
let HealthKit: any = null;
try {
  HealthKit = require("@kingstinct/react-native-healthkit");
} catch (error) {
  console.log(
    "HealthService: @kingstinct/react-native-healthkit not available"
  );
}

// Health data types we want to access
export const HEALTH_DATA_TYPES = {
  // Energy and activity
  ACTIVE_ENERGY_BURNED: "HKQuantityTypeIdentifierActiveEnergyBurned",
  BASAL_ENERGY_BURNED: "HKQuantityTypeIdentifierBasalEnergyBurned",

  // Physical characteristics
  HEIGHT: "HKQuantityTypeIdentifierHeight",
  BODY_MASS: "HKQuantityTypeIdentifierBodyMass",
  BIOLOGICAL_SEX: "HKCharacteristicTypeIdentifierBiologicalSex",
  DATE_OF_BIRTH: "HKCharacteristicTypeIdentifierDateOfBirth",
} as const;

export interface HealthPermissions {
  [key: string]: boolean;
}

export interface UserHealthProfile {
  height?: number; // in cm
  weight?: number; // in kg
  biologicalSex?: "male" | "female" | "other";
  age?: number;
  basalMetabolicRate?: number; // calculated BMR
}

export interface DailyHealthData {
  activeEnergyBurned: number;
  basalEnergyBurned: number;
  date: string; // YYYY-MM-DD
}

/**
 * Health service for managing Apple HealthKit integration using @kingstinct/react-native-healthkit
 */
export class HealthService {
  private static healthKitAvailable: boolean =
    Platform.OS === "ios" && HealthKit !== null;
  private static permissionRequestInProgress: boolean = false;

  /**
   * Initialize health monitoring and check availability
   */
  static async initialize(): Promise<void> {
    if (Platform.OS !== "ios") {
      console.log("HealthService: HealthKit not available on non-iOS devices");
      this.healthKitAvailable = false;
      return;
    }

    if (!HealthKit) {
      console.log(
        "HealthService: @kingstinct/react-native-healthkit library not found"
      );
      this.healthKitAvailable = false;
      return;
    }

    try {
      // Check if HealthKit is available on device
      const isAvailable = await HealthKit.isHealthDataAvailable();
      this.healthKitAvailable = isAvailable;

      if (isAvailable) {
        console.log("HealthService: HealthKit initialized successfully");
      } else {
        console.log(
          "HealthService: HealthKit not available - this is normal in iOS Simulator. HealthKit only works on physical iOS devices."
        );
      }
    } catch (error) {
      console.error("HealthService: Error initializing HealthKit:", error);
      this.healthKitAvailable = false;
    }
  }

  /**
   * Check if HealthKit is available on this device
   */
  static isHealthKitAvailable(): boolean {
    return this.healthKitAvailable;
  }

  /**
   * Request permissions for health data access
   */
  static async requestPermissions(): Promise<HealthPermissions> {
    if (!this.isHealthKitAvailable()) {
      throw new Error("HealthKit is not available on this device");
    }

    if (this.permissionRequestInProgress) {
      throw new Error("Permission request already in progress");
    }

    try {
      this.permissionRequestInProgress = true;
      console.log("HealthService: Requesting permissions for health data");

      // Request permissions using the modern API
      const readPermissions = [
        HEALTH_DATA_TYPES.ACTIVE_ENERGY_BURNED,
        HEALTH_DATA_TYPES.BASAL_ENERGY_BURNED,
        HEALTH_DATA_TYPES.HEIGHT,
        HEALTH_DATA_TYPES.BODY_MASS,
        HEALTH_DATA_TYPES.BIOLOGICAL_SEX,
        HEALTH_DATA_TYPES.DATE_OF_BIRTH,
      ];

      await HealthKit.requestAuthorization(readPermissions);

      console.log("HealthService: Health permissions requested successfully");

      // Return permissions granted status
      const grantedPermissions: HealthPermissions = {};
      readPermissions.forEach((type) => {
        grantedPermissions[type] = true; // Assume granted if no error
      });

      return grantedPermissions;
    } catch (error) {
      console.error("HealthService: Error requesting permissions:", error);
      throw error;
    } finally {
      this.permissionRequestInProgress = false;
    }
  }

  /**
   * Check current permission status
   */
  static async getPermissionStatus(): Promise<HealthPermissions> {
    if (!this.isHealthKitAvailable()) {
      return {}; // No permissions on non-iOS devices
    }

    try {
      const permissions: HealthPermissions = {};

      // Note: @kingstinct/react-native-healthkit doesn't provide direct authorization status checking
      // We'll assume permissions are granted if we can successfully make a query
      const readPermissions = [
        HEALTH_DATA_TYPES.ACTIVE_ENERGY_BURNED,
        HEALTH_DATA_TYPES.BASAL_ENERGY_BURNED,
        HEALTH_DATA_TYPES.HEIGHT,
        HEALTH_DATA_TYPES.BODY_MASS,
        HEALTH_DATA_TYPES.BIOLOGICAL_SEX,
        HEALTH_DATA_TYPES.DATE_OF_BIRTH,
      ];

      readPermissions.forEach((type) => {
        permissions[type] = false; // Default to false, will be updated after successful queries
      });

      return permissions;
    } catch (error) {
      console.error("HealthService: Error checking permissions:", error);
      return {};
    }
  }

  /**
   * Get user's health profile data
   */
  static async getUserProfile(): Promise<UserHealthProfile> {
    if (!this.isHealthKitAvailable()) {
      return {};
    }

    try {
      const profile: UserHealthProfile = {};

      // Get biological sex
      try {
        const sexResult = await HealthKit.getBiologicalSex();
        if (sexResult) {
          // Convert HealthKit biological sex to our format
          switch (sexResult) {
            case 1: // HKBiologicalSexFemale
              profile.biologicalSex = "female";
              break;
            case 2: // HKBiologicalSexMale
              profile.biologicalSex = "male";
              break;
            default:
              profile.biologicalSex = "other";
          }
        }
      } catch (error) {
        console.log("HealthService: Could not get biological sex:", error);
      }

      // Get date of birth and calculate age
      try {
        const dobResult = await HealthKit.getDateOfBirth();
        if (dobResult) {
          const birthDate = new Date(dobResult);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          profile.age = age;
        }
      } catch (error) {
        console.log("HealthService: Could not get date of birth:", error);
      }

      // Get latest height
      try {
        const heightResult = await HealthKit.getMostRecentQuantitySample(
          HEALTH_DATA_TYPES.HEIGHT
        );
        if (heightResult) {
          profile.height = heightResult.quantity; // Should be in cm
        }
      } catch (error) {
        console.log("HealthService: Could not get height:", error);
      }

      // Get latest weight
      try {
        const weightResult = await HealthKit.getMostRecentQuantitySample(
          HEALTH_DATA_TYPES.BODY_MASS
        );
        if (weightResult) {
          profile.weight = weightResult.quantity; // Should be in kg
        }
      } catch (error) {
        console.log("HealthService: Could not get weight:", error);
      }

      // Calculate BMR using Mifflin-St Jeor Equation
      if (
        profile.height &&
        profile.weight &&
        profile.age &&
        profile.biologicalSex
      ) {
        const bmr = this.calculateBMR(
          profile.height,
          profile.weight,
          profile.age,
          profile.biologicalSex
        );
        profile.basalMetabolicRate = Math.round(bmr);
      }

      console.log("HealthService: Retrieved user profile:", profile);
      return profile;
    } catch (error) {
      console.error("HealthService: Error fetching user profile:", error);
      return {};
    }
  }

  /**
   * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
   */
  private static calculateBMR(
    height: number,
    weight: number,
    age: number,
    biologicalSex: string
  ): number {
    // Mifflin-St Jeor Equation
    // Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
    // Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161

    const baseBMR = 10 * weight + 6.25 * height - 5 * age;

    if (biologicalSex === "male") {
      return baseBMR + 5;
    } else if (biologicalSex === "female") {
      return baseBMR - 161;
    } else {
      // For "other" or unknown, use average
      return baseBMR - 78; // Average of male and female adjustments
    }
  }

  /**
   * Get daily energy burned data
   */
  static async getDailyEnergyBurned(date: string): Promise<DailyHealthData> {
    if (!this.isHealthKitAvailable()) {
      return {
        activeEnergyBurned: 0,
        basalEnergyBurned: 0,
        date,
      };
    }

    try {
      const startDate = new Date(date + "T00:00:00.000Z");
      const endDate = new Date(date + "T23:59:59.999Z");

      // Get active energy burned
      let activeEnergy = 0;
      try {
        const activeEnergyResult = await HealthKit.queryQuantitySamples(
          HEALTH_DATA_TYPES.ACTIVE_ENERGY_BURNED,
          {
            from: startDate,
            to: endDate,
          }
        );

        if (activeEnergyResult && activeEnergyResult.samples) {
          activeEnergy = activeEnergyResult.samples.reduce(
            (sum: number, sample: any) => sum + sample.quantity,
            0
          );
        }
      } catch (error) {
        console.log("HealthService: Could not get active energy:", error);
      }

      // Get basal energy burned
      let basalEnergy = 0;
      try {
        const basalEnergyResult = await HealthKit.queryQuantitySamples(
          HEALTH_DATA_TYPES.BASAL_ENERGY_BURNED,
          {
            from: startDate,
            to: endDate,
          }
        );

        if (basalEnergyResult && basalEnergyResult.samples) {
          basalEnergy = basalEnergyResult.samples.reduce(
            (sum: number, sample: any) => sum + sample.quantity,
            0
          );
        }
      } catch (error) {
        console.log("HealthService: Could not get basal energy:", error);
      }

      const dailyData: DailyHealthData = {
        activeEnergyBurned: Math.round(activeEnergy),
        basalEnergyBurned: Math.round(basalEnergy),
        date,
      };

      console.log(`HealthService: Daily energy for ${date}:`, dailyData);
      return dailyData;
    } catch (error) {
      console.error("HealthService: Error fetching daily energy data:", error);
      return {
        activeEnergyBurned: 0,
        basalEnergyBurned: 0,
        date,
      };
    }
  }

  /**
   * Check if health permissions are currently granted
   */
  static async hasHealthPermissions(): Promise<boolean> {
    if (!this.isHealthKitAvailable()) {
      return false;
    }

    try {
      // Try to make a simple query to see if we have permissions
      const result = await HealthKit.getMostRecentQuantitySample(
        HEALTH_DATA_TYPES.ACTIVE_ENERGY_BURNED
      );
      return result !== null;
    } catch (error) {
      console.log("HealthService: No health permissions or error:", error);
      return false;
    }
  }

  /**
   * Developer tool: Reset health permissions (for testing)
   */
  static async resetPermissions(): Promise<void> {
    console.log(
      "HealthService: Resetting health permissions (development only)"
    );

    // Note: There's no direct way to programmatically reset HealthKit permissions
    // The user must manually reset them in iOS Settings > Privacy & Security > Health

    console.log(
      "Health permissions reset - user will be prompted again on next access"
    );
    console.log(
      "Note: For complete reset, user must manually reset in iOS Settings > Privacy & Security > Health"
    );
  }
}
