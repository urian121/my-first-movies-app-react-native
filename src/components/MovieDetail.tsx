import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchMovieById } from "../api/movies";
import { Movie } from "../types/movie";

interface MovieDetailProps {
  movieId: number;
  onClose: () => void;
}

// Genera estrellas visuales segun la calificacion de la pelicula.
const renderStars = (stars: number) => {
  const filled = Math.round(stars);
  return "★".repeat(filled) + "☆".repeat(Math.max(0, 5 - filled));
};

// Muestra la ficha completa de una pelicula seleccionada.
export function MovieDetail({ movieId, onClose }: MovieDetailProps) {
  const insets = useSafeAreaInsets();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Carga el detalle de la pelicula al abrir la vista.
  useEffect(() => {
    const loadMovie = async () => {
      try {
        const response = await fetchMovieById(movieId);
        if (!response) {
          setError("No se encontro la pelicula.");
          return;
        }
        setMovie(response);
      } catch {
        setError("No se pudo cargar el detalle.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [movieId]);

  return (
    <View className="absolute inset-0 z-50 bg-app-bg">
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#18181b" />
        </View>
      )}

      {!isLoading && error && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-red-500">{error}</Text>
          <Pressable
            onPress={onClose}
            className="rounded-full bg-zinc-900 px-5 py-2"
          >
            <Text className="font-semibold text-white">Volver</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && movie && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <View style={{ height: 420 + insets.top }}>
            <ImageBackground
              source={{ uri: movie.image_url }}
              style={styles.poster}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.45)", "rgba(0,0,0,0)", "rgba(252,249,245,1)"]}
                locations={[0, 0.45, 1]}
                style={StyleSheet.absoluteFill}
              />
            </ImageBackground>

            <Pressable
              onPress={onClose}
              style={{ top: insets.top + 12 }}
              className="absolute left-4 rounded-full bg-black/50 px-4 py-2"
            >
              <Text className="font-semibold text-white">← Volver</Text>
            </Pressable>
          </View>

          <View className="-mt-6 px-5">
            <Text className="text-3xl font-bold text-zinc-900">{movie.title}</Text>

            <Text className="mt-2 text-lg text-zinc-600">
              {movie.year} • {movie.stars.toFixed(1)} / 5
            </Text>

            <Text className="mt-2 text-2xl text-yellow-500">
              {renderStars(movie.stars)}
            </Text>

            <View className="mt-4 flex-row flex-wrap gap-2">
              {movie.genre.map((genre) => (
                <View
                  key={genre}
                  className="rounded-full bg-zinc-900 px-3 py-1"
                >
                  <Text className="text-sm font-medium text-white">{genre}</Text>
                </View>
              ))}
            </View>

            <Text className="mt-6 text-base leading-6 text-zinc-700">
              {movie.description}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  poster: {
    width: "100%",
    height: "100%",
  },
});
