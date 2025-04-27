/**
 * About Screen
 */
import { Image, Text, View } from "react-native";
import sharedStyles from "./styles/SharedStyles";

export default function AboutScreen(): React.JSX.Element {
  return (
    <View style={sharedStyles.container}>
      <Image source={require("./images/logo.png")} style={sharedStyles.image} />
      <Text style={sharedStyles.titleText}>About TestMate...</Text>
      <Text style={sharedStyles.text}>
        TestMate is a simple, cross-platform, custom quiz application that lets you study what your
        want, where your want, and when you want.
      </Text>
      <Text style={sharedStyles.titleText}>Why study alone?</Text>
    </View>
  );
}
