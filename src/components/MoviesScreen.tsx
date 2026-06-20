import { useEffect, useMemo, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchMovies } from "../api/movies";
import { Movie } from "../types/movie";
import { HeroBanner, getHeroHeight } from "./HeroBanner";
import { MovieCarousel } from "./MovieCarousel";
import { MovieDetail } from "./MovieDetail";
import { SplashLoading } from "./SplashLoading";

// Pantalla principal con hero destacado y carruseles horizontales.
export function MoviesScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const heroHeight = getHeroHeight(height, insets.top);
  const scrollY = useSharedValue(0);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const moviesWithPoster = useMemo(
    () => movies.filter((movie) => Boolean(movie.image_url)),
    [movies],
  );

  const popularMovies = useMemo(
    () => [...moviesWithPoster].sort((a, b) => b.stars - a.stars),
    [moviesWithPoster],
  );

  const topRatedMovies = useMemo(() => {
    const rated = [...moviesWithPoster]
      .filter((movie) => movie.stars >= 4)
      .sort((a, b) => b.stars - a.stars);

    return rated.length > 0 ? rated : popularMovies;
  }, [moviesWithPoster, popularMovies]);

  const actionMovies = useMemo(
    () =>
      moviesWithPoster.filter(
        (movie) =>
          movie.genre.some((genre) => genre.toLowerCase() === "action"),
      ),
    [moviesWithPoster],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Aplica parallax suave al hero mientras el usuario hace scroll vertical.
  const heroParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, heroHeight],
          [0, heroHeight * 0.2],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [0, heroHeight],
          [1, 1.03],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  // Carga peliculas al montar la pantalla.
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await fetchMovies();
        setMovies(response);
      } catch {
        setError("No se pudieron cargar las peliculas.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Selecciona una pelicula aleatoria una sola vez al cargar el catalogo.
  useEffect(() => {
    if (moviesWithPoster.length === 0 || featuredMovie) return;

    const randomIndex = Math.floor(Math.random() * moviesWithPoster.length);
    setFeaturedMovie(moviesWithPoster[randomIndex]);
  }, [moviesWithPoster, featuredMovie]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovieId(movie.id);
  };

  if (isLoading) {
    return <SplashLoading />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (!featuredMovie) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg">
        <Text className="text-zinc-600">No hay peliculas disponibles.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-app-bg">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="never"
      >
        <Animated.View
          style={[
            {
              height: heroHeight,
              marginTop: -insets.top,
              overflow: "hidden",
            },
            heroParallaxStyle,
          ]}
        >
          <HeroBanner
            movie={featuredMovie}
            onPress={() => handleSelectMovie(featuredMovie)}
          />
        </Animated.View>

        <MovieCarousel
          title="Populares"
          movies={popularMovies}
          onSelectMovie={handleSelectMovie}
        />
        <MovieCarousel
          title="Mejor calificadas"
          movies={topRatedMovies}
          onSelectMovie={handleSelectMovie}
        />
        <MovieCarousel
          title="Accion"
          movies={actionMovies}
          onSelectMovie={handleSelectMovie}
        />
      </Animated.ScrollView>

      {selectedMovieId !== null && (
        <MovieDetail
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </View>
  );
}
