/**
 * Utility file with functions used by more than one screen
 *
 * Requires npx expo install @react-native-async-storage/async-storage
 * 
 * Usage: import { returnHome, ... } from "./utils/utility";
 */

import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

// Keys to use with AsyncStorage
const SETTINGS_LIST: Array<string> = [
  "randomizeQuestions",
  "randomizeChoices",
  "immediateFeedback",
  "showScore",
];

// Values to use with AsyncStorage
// 1 is true and 0 is false
export const TRUE_VALUE_STR = "1";
export const FALSE_VALUE_STR = "0";

/**
 * Display an alert message based on the platform.
 *
 * @param {string} title The title of the alert box (may not be used).
 * @param {string} msgObj The message to display.
 */
export function customAlert(msgObj: any, title: string = "Alert"): void {
  // Validate inputs
  if (typeof msgObj !== "string" && typeof msgObj !== "object") {
    throw new Error("Invalid message.");
  }
  if (typeof title !== "string") {
    throw new Error("Invalid title.");
  }

  let message: string;
  if (msgObj instanceof Error) {
    message = msgObj.message;
  } else {
    message = msgObj as string;
  }

  // Check platform to determine which alert to use
  if (Platform.OS !== "web") {
    Alert.alert(title, message);
  } else {
    alert(message);
  }
}

/**
 * Return to home page and clear screen history.
 */
export function returnHome(): void {
  if (router.canGoBack()) {
    router.dismissAll();
  }
  router.replace("/");
}

/**
 * Shuffle an array in place. Can be an array of strings or numbers.
 *
 * @param {any[]} array The array to shuffle.
 * @returns {any[]} The shuffled array.
 */
export function shuffleArray(array: any[]): any[] {
  return array.sort(() => Math.random() - 0.5);
}

/**
 * Get the value of a setting from AsyncStorage.
 *
 * @param {string} settingName The name of the setting.
 * @returns {string} The value of the setting.
 * @see https://reactnative.dev/docs/asyncstorage
 */
export async function getSettingFromStorage(settingName: string): Promise<string> {
  // Return true if the key is not found or is null
  // True is the default value for all settings
  try {
    // Validate inputs
    if (typeof settingName !== "string") {
      throw new Error("Invalid argument type.");
    }
    // Use negation instead of `SETTINGS_LIST.includes(settingName) == false`
    if (!SETTINGS_LIST.includes(settingName)) {
      throw new Error("Invalid setting name.");
    }

    let _value = await AsyncStorage.getItem(settingName);
    _value = _value !== null ? String(JSON.parse(_value)) : null;

    // If the setting name is valid, but it does not exist in storage,
    // add it to storage with a default value of true
    if (_value === null) {
      saveSettingToStorage(settingName, TRUE_VALUE_STR);
      return TRUE_VALUE_STR;
    }
    return _value;
  } catch (error) {
    console.error(`Unable to retrieve setting: ${error}`);
    return TRUE_VALUE_STR;
  }
}

/**
 * Save the value of a setting to AsyncStorage.
 *
 * @param {string} settingName The name of the setting.
 * @param {string} settingValue The value of the setting.
 * @see https://reactnative.dev/docs/asyncstorage
 */
export async function saveSettingToStorage(
  settingName: string,
  settingValue: string
): Promise<void> {
  try {
    // Validate inputs
    if (typeof settingName !== "string" || typeof settingValue !== "string") {
      throw new Error("Invalid argument type(s).");
    }
    // Use negation instead of `SETTINGS_LIST.includes(settingName) == false`
    if (!SETTINGS_LIST.includes(settingName)) {
      throw new Error("Invalid setting name.");
    }
    if (![TRUE_VALUE_STR, FALSE_VALUE_STR].includes(settingValue)) {
      throw new Error("Invalid setting value.");
    }

    // Save the setting to storage
    await AsyncStorage.setItem(settingName, JSON.stringify(settingValue));
  } catch (error) {
    console.error("Unable to save setting:", error);
  }
}

// Route "./utils/utility.tsx" is missing the required default export. Ensure a React component is exported as default. [Component Stack]
function utility() {
  return null;
}
export default utility;
