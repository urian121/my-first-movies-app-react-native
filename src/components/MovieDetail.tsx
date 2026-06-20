import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
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
import { fetchMovieById, fetchRecommendedMovies } from "../api/movies";
import { Movie } from "../types/movie";
import { renderStars } from "../utils/stars";
import { MovieCarousel } from "./MovieCarousel";

// Muestra la ficha completa de una pelicula por ruta /movie/[id].
export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const insets = useSafeAreaInsets();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Carga el detalle y recomendaciones al abrir o cambiar la ruta.
  useEffect(() => {
    if (!movieId) {
      setError("Id de pelicula invalido.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    fetchMovieById(movieId)
      .then(async (response) => {
        if (cancelled) return;
        if (!response) {
          setError("No se encontro la pelicula.");
          return;
        }
        setMovie(response);
        setRecommendedMovies(await fetchRecommendedMovies(response));
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el detalle.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg">
        <ActivityIndicator size="large" color="#18181b" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg px-6">
        <Text className="mb-4 text-center text-red-500">
          {error || "No se encontro la pelicula."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="rounded-full bg-zinc-900 px-5 py-2"
        >
          <Text className="font-semibold text-white">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-app-bg"
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
          onPress={() => router.back()}
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
        <Text className="mt-2 text-2xl text-yellow-500">{renderStars(movie.stars)}</Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {movie.genre.map((genre) => (
            <View key={genre} className="rounded-full bg-zinc-900 px-3 py-1">
              <Text className="text-sm font-medium text-white">{genre}</Text>
            </View>
          ))}
        </View>

        <Text className="mt-6 text-base leading-6 text-zinc-700">{movie.description}</Text>
        <MovieCarousel title="Recomendadas" movies={recommendedMovies} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  poster: {
    width: "100%",
    height: "100%",
  },
});
