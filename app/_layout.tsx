import "react-native-gesture-handler";
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => null);

// Layout raiz con stack para tabs y detalle de peliculas.
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  // Oculta el splash nativo antes de montar la navegacion.
  useEffect(() => {
    SplashScreen.hideAsync()
      .catch(() => null)
      .finally(() => setIsReady(true));
  }, []);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#fcf9f5" } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(movies)" options={{ animation: "slide_from_right" }} />
      </Stack>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
