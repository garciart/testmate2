/**
 * Quiz engine
 *
 * Requires npx expo install expo-document-picker
 */
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import sharedStyles from "./styles/SharedStyles";
import { customAlert, returnHome, TRUE_VALUE_STR, shuffleArray } from "./utils/utility";

// Define the Quiz and QuizQuestion objects
export interface Quiz {
  title: string;
  author: string;
  questions: QuizQuestion[];
  preserveQuestionOrder?: boolean;
}

export interface QuizQuestion {
  questionText: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  preserveChoiceOrder?: boolean;
}

/**
 * Quiz Engine
 */
export default function QuizScreen(): React.JSX.Element {
  // Get settings from Index screen to prevent race conditions
  const quizParams = useLocalSearchParams();

  // Initialize stateful variables and define their setters
  const [showScreen, setShowScreen] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [choicesToDisplay, setChoicesToDisplay] = useState<string[]>([""] as string[]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [immediateFeedback] = useState<boolean>(quizParams.fb === TRUE_VALUE_STR);
  const [randomizeChoices] = useState<boolean>(quizParams.rc === TRUE_VALUE_STR);
  const [randomizeQuestions] = useState<boolean>(quizParams.rq === TRUE_VALUE_STR);
  const [percent, setPercent] = useState<number>(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([0] as number[]);
  const [quizData, setQuizData] = useState<Quiz>({
    title: "",
    author: "",
    questions: [],
    preserveQuestionOrder: false,
  } as Quiz);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    {
      questionText: "",
      choices: [""],
      correctAnswer: "",
      explanation: "",
      preserveChoiceOrder: true,
    },
  ] as QuizQuestion[]);
  const [showScore] = useState<boolean>(quizParams.ss === TRUE_VALUE_STR);
  const [score, setScore] = useState<number>(0);

  // Get settings from storage on initial render
  useLayoutEffect(() => {
    let isMounted = true;
    const openQuiz = async () => {
      // Have the user select a quiz file
      let _quizInfo = await DocumentPicker.getDocumentAsync({
        type: ["application/json"],
        multiple: false,
      });

      /* Example:
            _result = {
                    "assets": [{"mimeType": "application/json",
                    "name": "test1.json",
                    "size": 1585,
                    "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/01234567-89ab-cdef-0123-456789abcdef.json"}],
                    "canceled": false}
            */

      // _quizInfo.assets is null if the user cancels instead of selecting a file
      if (!_quizInfo.canceled) {
        try {
          let _fileContents = null;
          if (Platform.OS !== "web") {
            _fileContents = await FileSystem.readAsStringAsync(_quizInfo.assets[0].uri, {
              encoding: FileSystem.EncodingType.UTF8,
            });
          } else {
            // Need to fix:
            // Error: The method or property expo-file-system.readAsStringAsync is not available on web, are you sure you've linked all the native dependencies properly?
            customAlert("TODO: Open files using a browser.");
            returnHome();
          }

          if (_fileContents) {
            // Attempt to convert the file contents to a Quiz object
            if (isMounted) populateVariables(_fileContents);
            // Show screen after everything is loaded
            setShowScreen(true);
          } else {
            throw new Error("Cannot read file.");
          }
        } catch (error) {
          console.log(error as string);
          customAlert(error, "Error");
          returnHome();
        }
      } else {
        returnHome();
      }
    };

    const populateVariables = (jsonString: string) => {
      try {
        // Validate inputs
        if (typeof jsonString !== "string") {
          throw new Error("Invalid argument type.");
        }

        // Attempt to convert the JSON string to a Quiz object
        let _quizData: Quiz = JSON.parse(jsonString);

        if (!_quizData?.title || !Array.isArray(_quizData.questions)) {
          throw new Error("Invalid quiz file format.");
        }

        // Attempt to create a list of QuizQuestion objects
        let _quizQuestions: QuizQuestion[] = _quizData.questions;

        if (!_quizQuestions.length || !_quizQuestions[0]?.questionText) {
          throw new Error("Invalid quiz format.");
        }

        // The default question order is a zero-based ordered sequence from 0 to numOfQuestions - 1
        let _questionOrder = getQuestionOrderArray(_quizQuestions);

        // Perform these checks at the start of a quiz
        // FYI, JSON settings in the quiz file override app settings
        // For example, if the file defines preserveQuestionOrder and sets it to true,
        // the app will preserve the question order as it appears in the file,
        // even if the randomizeQuestions setting is checked
        if (currentQuestionIndex == 0) {
          if (
            // Check if preserveQuestionOrder is defined and equal to false
            (typeof _quizData.preserveQuestionOrder !== "undefined" &&
              !_quizData.preserveQuestionOrder) ||
            // Check if preserveQuestionOrder is undefined and randomizeQuestions is true
            (typeof _quizData.preserveQuestionOrder === "undefined" && randomizeQuestions)
          ) {
            //Shuffle the question order
            shuffleArray(_questionOrder);
          }
        }

        // Allow access to values outside of function scope
        setQuizData(_quizData);
        setQuizQuestions(_quizQuestions);
        setQuestionOrder(_questionOrder);

        customAlert(`You selected ${_quizData.title}`, "Get ready!");
      } catch (error) {
        customAlert(error as Error, "Error");
        returnHome();
      }
    };

    // Helper function to instantiate a default question order when the app starts
    const getQuestionOrderArray = (quizQuestions: QuizQuestion[]): number[] => {
      const numOfQuestions = quizQuestions.length;
      // Return a zero-based ordered sequence from 0 to numOfQuestions - 1
      return Array.from(Array(numOfQuestions).keys());
    };

    openQuiz();
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once after the initial render

  // Only alert after a stateful variable changes to prevent out-of-order alerting
  useEffect(() => {
    // FYI, JSON settings in the quiz file override app settings
    // For example, if the file defines preserveChoiceOrder and sets it to true,
    // the app will preserve the choice order as it appears in the file,
    // even if the randomizeChoices setting is checked
    let _preserveOrder = true;
    if (
      // Check if preserveChoiceOrder is defined and equal to false
      (typeof quizQuestions[questionOrder[currentQuestionIndex]].preserveChoiceOrder !==
        "undefined" &&
        !quizQuestions[questionOrder[currentQuestionIndex]].preserveChoiceOrder) ||
      // Check if preserveChoiceOrder is undefined and randomizeQuestions is true
      (typeof quizQuestions[questionOrder[currentQuestionIndex]].preserveChoiceOrder ===
        "undefined" &&
        randomizeChoices)
    ) {
      _preserveOrder = false;
    }

    // Randomize choices if the setting is enabled
    let _choicesToDisplay = _preserveOrder
      ? quizQuestions[questionOrder[currentQuestionIndex]].choices
      : shuffleArray([...quizQuestions[questionOrder[currentQuestionIndex]].choices]);

    setChoicesToDisplay(_choicesToDisplay as string[]);

    if (quizFinished) {
      let _finishMsg = `Quiz finished! You scored ${score} out of ${quizQuestions.length} correct (${percent}%).`;
      // Prepend the final message with an explanation if immediateFeedback option is set
      // Do not attempt to pass two alerts or they may appear out of order
      if (immediateFeedback) {
        _finishMsg = `${alertMsg}\n${_finishMsg}`;
      }
      customAlert(_finishMsg, "All done!");
      // End the loop by returning to Home screen
      returnHome();
    } else if (currentQuestionIndex > 0 && !quizFinished) {
      // Only display an explanation if immediate feedback option is set
      if (immediateFeedback) {
        let alertTitle = alertMsg.toLowerCase().includes("correct") ? "Correct" : "Oops!";
        customAlert(`${alertMsg}`, `${alertTitle}`);
      }
    }
  }, [currentQuestionIndex, quizFinished, quizQuestions, randomizeChoices]);

  // Handle the choice selection event
  const handleAnswer = (selectedAnswer: string) => {
    // Create an alert message with an explanation for useEffect
    let explanation = " " + quizQuestions[questionOrder[currentQuestionIndex]].explanation;

    // Check the selected choice
    const nextScore =
      selectedAnswer === quizQuestions[questionOrder[currentQuestionIndex]].correctAnswer
        ? score + 1
        : score;
    const nextAlertMsg =
      selectedAnswer === quizQuestions[questionOrder[currentQuestionIndex]].correctAnswer
        ? `That is correct! ${explanation}`
        : `Sorry, but that is wrong. ${explanation}`;

    setScore(nextScore);
    setAlertMsg(nextAlertMsg);

    let _percent = Number(((nextScore / (Number(currentQuestionIndex) + 1)) * 100 || 0).toFixed(2));
    setPercent(_percent);

    // Move on to next question or finish the quiz
    if (currentQuestionIndex >= quizQuestions.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Return empty view to avoid flash before quiz is loaded
  if (!showScreen) {
    return <View style={sharedStyles.container}></View>;
  } else {
    return (
      <View style={sharedStyles.container}>
        <Stack.Screen options={{ title: quizData.title }}></Stack.Screen>
        <Text style={sharedStyles.titleText}>{quizData.title}</Text>
        <Text>{`Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`}</Text>
        <Text>{quizQuestions[questionOrder[currentQuestionIndex]].questionText}</Text>
        {choicesToDisplay.map((choice) => (
          <TouchableOpacity
            style={sharedStyles.button}
            key={choice}
            onPress={() => handleAnswer(choice)}
          >
            <Text style={sharedStyles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}
        <Text>{showScore && `Score: ${score} (${percent}%)`}</Text>
      </View>
    );
  }
}
