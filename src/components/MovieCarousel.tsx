import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { moviePath } from "../navigation/routes";
import { Movie } from "../types/movie";

export interface MovieCarouselSize {
  width: number;
  height: number;
}

export const DEFAULT_CAROUSEL_SIZE: MovieCarouselSize = {
  width: 100,
  height: 150,
};

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  size?: MovieCarouselSize;
}

const ITEM_SPACING = 12;

interface MovieCarouselItemProps {
  movie: Movie;
  index: number;
  scrollX: SharedValue<number>;
  itemSize: number;
  size: MovieCarouselSize;
}

// Renderiza el poster con escala y elevacion segun su posicion en el carrusel.
function MovieCarouselItem({
  movie,
  index,
  scrollX,
  itemSize,
  size,
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
          width: size.width,
          marginRight: ITEM_SPACING,
        },
        animatedStyle,
      ]}
    >
      <Pressable onPress={() => router.push(moviePath(movie.id))}>
        <Image
          source={{ uri: movie.image_url }}
          style={{ width: size.width, height: size.height }}
          className="rounded-xl bg-zinc-200"
          resizeMode="cover"
        />
      </Pressable>
    </Animated.View>
  );
}

// Muestra un carrusel horizontal alineado a la izquierda con mas posters visibles.
export function MovieCarousel({
  title,
  movies,
  size = DEFAULT_CAROUSEL_SIZE,
}: MovieCarouselProps) {
  const scrollX = useSharedValue(0);
  const itemSize = size.width + ITEM_SPACING;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (movies.length === 0) return null;

  return (
    <View className="mb-3">
      <Text className="mb-2 mt-3 px-4 text-2xl text-orange-500">{title}</Text>
      <Animated.FlatList
        data={movies}
        horizontal
        keyExtractor={(item) => `${title}-${item.id}`}
        renderItem={({ item, index }) => (
          <MovieCarouselItem
            movie={item}
            index={index}
            scrollX={scrollX}
            itemSize={itemSize}
            size={size}
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
