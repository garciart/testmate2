/**
 * Quiz settings page
 *
 * Requires npx expo install expo-checkbox
 */

import { Text, TouchableOpacity, View } from "react-native";
import sharedStyles from "./styles/SharedStyles";
import { useLayoutEffect, useState } from "react";
import Checkbox from "expo-checkbox";
import {
  returnHome,
  TRUE_VALUE_STR,
  FALSE_VALUE_STR,
  getSettingFromStorage,
  saveSettingToStorage,
} from "./utils/utility";

/**
 * Get and save quiz settings using checkboxes.
 */
export default function SettingsScreen(): React.JSX.Element {
  // Initialize stateful variables and define their setters
  const [randomizeQuestions, setRandomizeQuestions] = useState(TRUE_VALUE_STR);
  const [randomizeChoices, setRandomizeChoices] = useState(TRUE_VALUE_STR);
  const [immediateFeedback, setImmediateFeedback] = useState(TRUE_VALUE_STR);
  const [showScore, setShowScore] = useState(TRUE_VALUE_STR);

  // Get values from storage and populate checkboxes before rendering the screen
  useLayoutEffect(() => {
    const getSettingsFromStorage = async () => {
      setRandomizeQuestions(await getSettingFromStorage("randomizeQuestions"));
      setRandomizeChoices(await getSettingFromStorage("randomizeChoices"));
      setImmediateFeedback(await getSettingFromStorage("immediateFeedback"));
      setShowScore(await getSettingFromStorage("showScore"));
    };
    getSettingsFromStorage();
  }, []); // Empty dependency array ensures this runs only once after the initial render

  /**
   * Save settings to storage when Save Settings button is pressed.
   */
  const saveSettings = async () => {
    await saveSettingToStorage("randomizeQuestions", randomizeQuestions);
    await saveSettingToStorage("randomizeChoices", randomizeChoices);
    await saveSettingToStorage("immediateFeedback", immediateFeedback);
    await saveSettingToStorage("showScore", showScore);
    returnHome();
  };

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.titleText}>Settings:</Text>
      <View style={sharedStyles.checkboxRow}>
        <Checkbox
          style={sharedStyles.checkbox}
          value={randomizeQuestions === TRUE_VALUE_STR}
          onValueChange={() => {
            let value =
              randomizeQuestions == FALSE_VALUE_STR
                ? TRUE_VALUE_STR
                : FALSE_VALUE_STR;
            setRandomizeQuestions(value);
          }}
        />
        <Text style={sharedStyles.text}>Randomize Questions?</Text>
      </View>
      <View style={sharedStyles.checkboxRow}>
        <Checkbox
          style={sharedStyles.checkbox}
          value={randomizeChoices === TRUE_VALUE_STR}
          onValueChange={() => {
            let value =
              randomizeChoices == FALSE_VALUE_STR
                ? TRUE_VALUE_STR
                : FALSE_VALUE_STR;
            setRandomizeChoices(value);
          }}
        />
        <Text style={sharedStyles.text}>Randomize Choices?</Text>
      </View>
      <View style={sharedStyles.checkboxRow}>
        <Checkbox
          style={sharedStyles.checkbox}
          value={immediateFeedback === TRUE_VALUE_STR}
          onValueChange={() => {
            let value =
              immediateFeedback == FALSE_VALUE_STR
                ? TRUE_VALUE_STR
                : FALSE_VALUE_STR;
            setImmediateFeedback(value);
          }}
        />
        <Text style={sharedStyles.text}>Give Immediate Feedback?</Text>
      </View>
      <View style={sharedStyles.checkboxRow}>
        <Checkbox
          style={sharedStyles.checkbox}
          value={showScore === TRUE_VALUE_STR}
          onValueChange={() => {
            let value =
              showScore == FALSE_VALUE_STR ? TRUE_VALUE_STR : FALSE_VALUE_STR;
            setShowScore(value);
          }}
        />
        <Text style={sharedStyles.text}>Show Score?</Text>
      </View>
      <TouchableOpacity
        style={sharedStyles.button}
        onPress={() => saveSettings()}
      >
        <Text style={sharedStyles.buttonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
