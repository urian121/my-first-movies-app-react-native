import { useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { Movie } from "../types/movie";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onSelectMovie?: (movie: Movie) => void;
}

const POSTER_WIDTH = 100;
const POSTER_HEIGHT = 150;
const ITEM_SPACING = 12;

interface MovieCarouselItemProps {
  movie: Movie;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  onSelectMovie?: (movie: Movie) => void;
}

// Renderiza el poster con escala y elevacion segun su posicion en el carrusel.
function MovieCarouselItem({
  movie,
  index,
  scrollX,
  itemSize,
  onSelectMovie,
}: MovieCarouselItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const centerOffset = index * itemSize;

    const scale = interpolate(
      scrollX.value,
      [centerOffset - itemSize, centerOffset, centerOffset + itemSize],
      [0.96, 1.04, 0.96],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollX.value,
      [centerOffset - itemSize, centerOffset, centerOffset + itemSize],
      [2, -4, 2],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: POSTER_WIDTH,
          marginRight: ITEM_SPACING,
        },
        animatedStyle,
      ]}
    >
      <Pressable onPress={() => onSelectMovie?.(movie)}>
        <Image
          source={{ uri: movie.image_url }}
          style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
          className="rounded-xl bg-zinc-200"
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Movie>);

// Muestra un carrusel horizontal alineado a la izquierda con mas posters visibles.
export function MovieCarousel({ title, movies, onSelectMovie }: MovieCarouselProps) {
  const scrollX = useSharedValue(0);
  const listRef = useRef<FlatList<Movie>>(null);
  const itemSize = POSTER_WIDTH + ITEM_SPACING;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (movies.length === 0) return null;

  return (
    <View className="mb-3">
      <Text className="mb-2 mt-3 px-4 text-lg font-bold text-zinc-900">{title}</Text>
      <AnimatedFlatList
        ref={listRef}
        data={movies}
        horizontal
        keyExtractor={(item) => `${title}-${item.id}`}
        renderItem={({ item, index }) => (
          <MovieCarouselItem
            movie={item}
            index={index}
            scrollX={scrollX}
            itemSize={itemSize}
            onSelectMovie={onSelectMovie}
          />
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 6,
        }}
      />
    </View>
  );
}
