/**
 * Not found page
 */
import { View, Text } from "react-native";
import { Link } from "expo-router";
import sharedStyles from "./styles/SharedStyles";

export default function NotFoundScreen(): React.JSX.Element {
  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.titleText}>Page Not Found</Text>
      <Link href="/" style={sharedStyles.button}>
        Return Home
      </Link>
    </View>
  );
}
