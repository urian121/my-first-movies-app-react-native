import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
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
import { moviePath } from "../navigation/routes";
import { Movie } from "../types/movie";
import { renderStars } from "../utils/stars";

interface HeroBannerProps {
  movie: Movie;
  height: number;
}

// Calcula la altura responsiva del hero segun la pantalla.
export const getHeroHeight = (screenHeight: number, topInset: number) =>
  screenHeight * 0.7 + topInset;

// Muestra la pelicula destacada con fade inferior tipo mask-image.
export function HeroBanner({ movie, height }: HeroBannerProps) {
  const { width } = useWindowDimensions();
  const imageScale = width < 380 ? 1.24 : width < 430 ? 1.18 : 1.14;
  const titleSize = width < 380 ? "text-2xl" : "text-3xl";

  useEffect(() => {
    if (Platform.OS !== "android") return;
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }, []);

  return (
    <Pressable
      onPress={() => router.push(moviePath(movie.id))}
      style={{ width: "100%", height }}
    >
      <ImageBackground
        source={{ uri: movie.image_url }}
        style={styles.image}
        imageStyle={{
          width,
          height,
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

      <View className="mb-5" style={styles.content}>
        <Text className={`text-center font-bold text-orange-500 ${titleSize}`}>
          {movie.title}
        </Text>
        <Text className="text-center text-lg text-orange-500">
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
    paddingBottom: 18,
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
