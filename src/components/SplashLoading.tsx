import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

// Pantalla de carga animada mientras se prepara el catalogo.
export function SplashLoading() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <LinearGradient
      colors={["#9a3412", "#ea580c", "#fb923c"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          style={iconAnimatedStyle}
          className="mb-6 h-28 w-28 items-center justify-center rounded-full bg-white/20"
        >
          <Text className="text-6xl">🎬</Text>
        </Animated.View>

        <Text className="text-center text-4xl font-bold text-white">
          Movies App
        </Text>
        <Text className="mt-2 text-center text-base text-orange-100">
          Descubriendo peliculas para ti
        </Text>

        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={{ marginTop: 32 }}
        />
      </View>
    </LinearGradient>
  );
}
