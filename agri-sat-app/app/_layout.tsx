import { Stack } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { AgriProvider } from "../state-controller/agri-context";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Sora-Regular": require("@/assets/fonts/Sora-Regular.ttf"),
    "Sora-Semibold": require("@/assets/fonts/Sora-SemiBold.ttf"),
    "Sora-Bold": require("@/assets/fonts/Sora-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null; // Better than `undefined`
  }

  return (
    <AgriProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AgriProvider>
  );
}