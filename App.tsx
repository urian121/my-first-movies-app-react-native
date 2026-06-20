import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import { MoviesScreen } from "./src/components/MoviesScreen";

SplashScreen.preventAutoHideAsync().catch(() => null);

// Punto de entrada de la aplicacion.
export default function App() {
  const [isNativeSplashHidden, setIsNativeSplashHidden] = useState(false);

  // Oculta el splash nativo y muestra el splash animado de la app.
  useEffect(() => {
    const hideNativeSplash = async () => {
      await SplashScreen.hideAsync();
      setIsNativeSplashHidden(true);
    };

    hideNativeSplash().catch(() => setIsNativeSplashHidden(true));
  }, []);

  if (!isNativeSplashHidden) return null;

  return (
    <SafeAreaProvider>
      <MoviesScreen />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
