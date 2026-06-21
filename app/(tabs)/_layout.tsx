import { Tabs } from "expo-router";

// Tabs principales de la app (extensible a favoritos, busqueda, etc.).
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    />
  );
}
