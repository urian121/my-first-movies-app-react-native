import { Tabs } from "expo-router";

// Tabs principales de la app (extensible a favoritos, busqueda, etc.).
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#18181b",
        tabBarStyle: { backgroundColor: "#fcf9f5", borderTopColor: "#e4e4e7" },
      }}
    />
  );
}
