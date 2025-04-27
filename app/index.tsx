/**
 * Application landing page
 *
 * Requires npx expo install @react-native-async-storage/async-storage
 *
 * Usage: npx expo start
 */
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import sharedStyles from "./styles/SharedStyles";
import { TRUE_VALUE_STR, getSettingFromStorage } from "./utils/utility";

/**
 * Get settings from storage to pass them to the quiz screen, then
 * display three button links to take a quiz, change settings, or get app info
 */
export default function Index(): React.JSX.Element {
  // Initialize stateful variables and define their setters
  const [randomizeQuestions, setRandomizeQuestions] = useState(TRUE_VALUE_STR);
  const [randomizeChoices, setRandomizeChoices] = useState(TRUE_VALUE_STR);
  const [immediateFeedback, setImmediateFeedback] = useState(TRUE_VALUE_STR);
  const [showScore, setShowScore] = useState(TRUE_VALUE_STR);

  // Get settings from storage on initial render
  useEffect(() => {
    const populateParams = async () => {
      setRandomizeQuestions(await getSettingFromStorage("randomizeQuestions"));
      setRandomizeChoices(await getSettingFromStorage("randomizeChoices"));
      setImmediateFeedback(await getSettingFromStorage("immediateFeedback"));
      setShowScore(await getSettingFromStorage("showScore"));
    };
    populateParams();
  }, []);

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.titleText}>Welcome to TestMate!</Text>
      <Image source={require("./images/logo.png")} style={sharedStyles.image} />
      <Link
        href={{
          pathname: "/quiz",
          // Pass settings to the quiz screen as parameters
          params: {
            rq: randomizeQuestions,
            rc: randomizeChoices,
            fb: immediateFeedback,
            ss: showScore,
          },
        }}
        style={sharedStyles.button}
      >
        <Text style={sharedStyles.buttonText}>Take a Quiz</Text>
      </Link>
      <Link href="/settings" style={sharedStyles.button}>
        <Text style={sharedStyles.buttonText}>Change Settings</Text>
      </Link>
      <Link href="/about" style={sharedStyles.button}>
        <Text style={sharedStyles.buttonText}>About TestMate</Text>
      </Link>
    </View>
  );
}
