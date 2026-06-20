import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Movie } from "../types/movie";

interface HeroBannerProps {
  movie: Movie;
  onPress?: () => void;
}

// Calcula la altura responsiva del hero segun la pantalla.
export const getHeroHeight = (screenHeight: number, topInset: number) =>
  screenHeight * 0.7 + topInset;

// Genera estrellas visuales segun la calificacion de la pelicula.
const renderStars = (stars: number) => {
  const filled = Math.round(stars);
  return "★".repeat(filled) + "☆".repeat(Math.max(0, 5 - filled));
};

// Muestra la pelicula destacada con fade inferior tipo mask-image.
export function HeroBanner({ movie, onPress }: HeroBannerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const heroHeight = useMemo(
    () => getHeroHeight(height, insets.top),
    [height, insets.top],
  );

  const imageScale = width < 380 ? 1.24 : width < 430 ? 1.18 : 1.14;
  const titleSize = width < 380 ? "text-2xl" : "text-3xl";

  useEffect(() => {
    if (Platform.OS !== "android") return;
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }, []);

  return (
    <Pressable onPress={onPress} style={{ width: "100%", height: heroHeight }}>
      <ImageBackground
        source={{ uri: movie.image_url }}
        style={styles.image}
        imageStyle={{
          width,
          height: heroHeight,
          transform: [{ scale: imageScale }],
        }}
        resizeMode="cover"
      >
        <View style={{ flex: 1 }} />
      </ImageBackground>

      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(0, 0, 0, 0)",
          "rgba(244, 244, 245, 0.55)",
          "rgba(244, 244, 245, 1)",
        ]}
        locations={[0, 0.62, 1]}
        style={styles.bottomMask}
      />

      <View className="mb-5" style={[styles.content, { paddingBottom: Math.max(18, height * 0.026) }]}>
        <Text className={`text-center font-bold text-black ${titleSize}`}>
          {movie.title}
        </Text>
        <Text className="text-center text-lg text-black">
          {movie.year} • {movie.genre.join(", ")}
        </Text>
        <Text className="text-center text-2xl text-yellow-300">
          {renderStars(movie.stars)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  content: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  bottomMask: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "18%",
    zIndex: 1,
  },
});
