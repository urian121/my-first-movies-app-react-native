import axios from "axios";
import { Movie, MovieApiItem } from "../types/movie";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MOVIE_URL,
});

// Convierte un item parcial de API a una pelicula tipada y consistente.
const mapMovie = (movie: MovieApiItem): Movie => ({
  id: movie.id ?? 0,
  title: movie.title ?? "Sin titulo",
  description: movie.description ?? "Sin descripcion",
  year: movie.year ?? 0,
  image_url: movie.image_url ?? "",
  genre: movie.genre?.length ? movie.genre : ["Sin genero"],
  stars: movie.stars ?? 0,
});

// Consulta el listado principal de peliculas y retorna datos normalizados.
export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await api.get<unknown>("/");

  if (!Array.isArray(data)) return [];
  return data
    .filter((item): item is MovieApiItem => typeof item === "object" && item !== null)
    .map(mapMovie)
    .filter((movie) => movie.id !== 0);
};

// Consulta una pelicula por id y retorna su detalle normalizado.
export const fetchMovieById = async (id: number): Promise<Movie | null> => {
  const { data } = await api.get<unknown>(`/${id}`);

  if (typeof data !== "object" || data === null) return null;
  const movie = mapMovie(data as MovieApiItem);
  return movie.id !== 0 ? movie : null;
};
