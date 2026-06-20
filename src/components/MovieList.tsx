import { FlatList, Text } from "react-native";
import { Movie } from "../types/movie";
import { MovieCard } from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
}

// Renderiza la lista de peliculas usando FlatList.
export function MovieList({ movies }: MovieListProps) {
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <MovieCard movie={item} />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text className="text-zinc-300">No hay peliculas disponibles.</Text>
      }
    />
  );
}
