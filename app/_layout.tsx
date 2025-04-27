import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Welcome!" }} />
      <Stack.Screen name="quiz" options={{ title: "Take a Test" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen name="+not-found" options={{ title: "Page Not Found" }} />
    </Stack>
  );
}
