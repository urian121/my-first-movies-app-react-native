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
import { DEFAULT_CAROUSEL_SIZE, MovieCarousel } from "./MovieCarousel";
import { SplashLoading } from "./SplashLoading";

const LARGE_CAROUSEL_SIZE = { width: 140, height: 210 };

const CAROUSELS = [
  { title: "Populares", key: "popular" as const },
  { title: "Mejor calificadas", key: "topRated" as const, size: LARGE_CAROUSEL_SIZE },
  { title: "Accion", key: "action" as const },
];

// Pantalla principal con hero destacado y carruseles horizontales.
export function MoviesScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const heroHeight = getHeroHeight(height, insets.top);
  const scrollY = useSharedValue(0);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const moviesWithPoster = useMemo(
    () => movies.filter((movie) => Boolean(movie.image_url)),
    [movies],
  );

  const carouselMovies = useMemo(() => {
    const byStars = [...moviesWithPoster].sort((a, b) => b.stars - a.stars);
    const topRated = moviesWithPoster.filter((movie) => movie.stars >= 4);

    return {
      popular: byStars,
      topRated: topRated.length > 0 ? [...topRated].sort((a, b) => b.stars - a.stars) : byStars,
      action: moviesWithPoster.filter((movie) =>
        movie.genre.some((genre) => genre.toLowerCase() === "action"),
      ),
    };
  }, [moviesWithPoster]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  // Carga peliculas y selecciona el hero destacado al montar.
  useEffect(() => {
    fetchMovies()
      .then((response) => {
        setMovies(response);
        const withPoster = response.filter((movie) => movie.image_url);
        if (withPoster.length > 0) {
          setFeaturedMovie(withPoster[Math.floor(Math.random() * withPoster.length)]);
        }
      })
      .catch(() => setError("No se pudieron cargar las peliculas."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SplashLoading />;

  if (error || !featuredMovie) {
    return (
      <View className="flex-1 items-center justify-center bg-app-bg">
        <Text className={error ? "text-red-500" : "text-zinc-600"}>
          {error || "No hay peliculas disponibles."}
        </Text>
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
            { height: heroHeight, marginTop: -insets.top, overflow: "hidden" },
            heroParallaxStyle,
          ]}
        >
          <HeroBanner movie={featuredMovie} height={heroHeight} />
        </Animated.View>

        {CAROUSELS.map(({ title, key, size = DEFAULT_CAROUSEL_SIZE }) => (
          <MovieCarousel
            key={key}
            title={title}
            movies={carouselMovies[key]}
            size={size}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
