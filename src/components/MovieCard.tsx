import { Text, View } from "react-native";
import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

// Muestra la informacion resumida de una pelicula en la lista.
export function MovieCard({ movie }: MovieCardProps) {
  return (
    <View className="mb-3 rounded-xl bg-zinc-900 p-4">
      <Text className="text-lg font-bold text-white">{movie.title}</Text>
      <Text className="mt-1 text-zinc-300">Año: {movie.year}</Text>
      <Text className="mt-1 text-zinc-300">Generos: {movie.genre.join(", ")}</Text>
      <Text className="mt-1 text-zinc-300">Rating: {movie.stars.toFixed(1)}</Text>
      <Text className="mt-2 text-zinc-400" numberOfLines={3}>
        {movie.description}
      </Text>
    </View>
  );
}
