/**
 * Styling file with styles used by more than one screen
 *
 * Usage: import sharedStyles from "./styles/SharedStyles";
 */
import { StyleSheet } from "react-native";

const sharedStyles = StyleSheet.create({
  button: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "stretch",
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  checkbox: {
    margin: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  image: {
    margin: 30,
  },
  titleText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
  text: {
    color: "black",
  },
});

export default sharedStyles;
