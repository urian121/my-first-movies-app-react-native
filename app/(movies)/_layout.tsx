import { Stack } from "expo-router";

// Stack del grupo de peliculas para pantallas de detalle.
export default function MoviesLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
