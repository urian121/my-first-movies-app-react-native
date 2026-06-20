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

// Normaliza un arreglo crudo de la API a peliculas validas.
const parseMovieList = (data: unknown): Movie[] => {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item): item is MovieApiItem => typeof item === "object" && item !== null)
    .map(mapMovie)
    .filter((movie) => movie.id !== 0);
};

// Consulta el listado principal de peliculas y retorna datos normalizados.
export const fetchMovies = async (): Promise<Movie[]> => {
  const { data } = await api.get<unknown>("/");
  return parseMovieList(data);
};

// Consulta una pelicula por id y retorna su detalle normalizado.
export const fetchMovieById = async (id: number): Promise<Movie | null> => {
  const { data } = await api.get<unknown>(`/${id}`);
  if (typeof data !== "object" || data === null) return null;
  const movie = mapMovie(data as MovieApiItem);
  return movie.id !== 0 ? movie : null;
};

// Consulta peliculas filtradas por un genero especifico.
export const fetchMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  const { data } = await api.get<unknown>(`/genre/${encodeURIComponent(genre)}`);
  return parseMovieList(data);
};

// Obtiene recomendaciones segun los generos de la pelicula, sin duplicados.
export const fetchRecommendedMovies = async (movie: Movie): Promise<Movie[]> => {
  const genres = movie.genre.filter((genre) => genre !== "Sin genero");
  if (genres.length === 0) return [];

  const byGenre = await Promise.all(genres.map(fetchMoviesByGenre));
  const seen = new Set<number>([movie.id]);
  const recommended: Movie[] = [];

  for (const movies of byGenre) {
    for (const item of movies) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      recommended.push(item);
    }
  }

  return recommended.sort((a, b) => b.stars - a.stars);
};
