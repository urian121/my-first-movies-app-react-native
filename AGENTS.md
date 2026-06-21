# AGENTS.md — App Movies

## Contexto del proyecto

- App: `my-movies-app` (React Native + Expo SDK 56).
- Entrada: `expo-router/entry` — navegación file-based en `app/`.
- UI: usar siempre [NativeWind](https://www.nativewind.dev/) (`className`, no StyleSheet salvo animaciones/layout).
- HTTP: usar siempre `axios` vía `src/api/movies.ts`.
- Animaciones: `react-native-reanimated` (`Animated.FlatList`, `useAnimatedStyle`, etc.).
- Estado global: usar `zustand` solo cuando se requiera estado compartido entre pantallas (favoritos, etc.).

## Navegacion (Expo Router)

```
app/_layout.tsx           → Stack raiz
app/(tabs)/index.tsx      → Home (MoviesScreen)
app/(movies)/movie/[id]   → Detalle (MovieDetail)
```

- Rutas agrupadas: `(tabs)` y `(movies)` no afectan la URL.
- Detalle: `/movie/:id` — usar `moviePath(id)` de `src/navigation/routes.ts`.
- Navegar con `router.push(moviePath(id))` o `router.back()`.
- Tab bar oculta mientras solo exista una tab; mostrarla al agregar nuevas pantallas en `(tabs)/`.

## API de peliculas

- Documentacion: `https://devsapihub.com/docs/api-movies`.
- Base URL (env): `EXPO_PUBLIC_MOVIE_URL=https://devsapihub.com/api-movies`.
- Mantener tipado con interfaces en `src/types/movie.ts`.
- Campo `genre` es un **array de strings**: `["Adventure", "Fantasy"]`.

### Endpoints

| Metodo | Ruta | Funcion en `src/api/movies.ts` |
|---|---|---|
| GET | `/api-movies` | `fetchMovies()` |
| GET | `/api-movies/:id` | `fetchMovieById(id)` |
| GET | `/api-movies/genre/:genre` | `fetchMoviesByGenre(genre)` |
| — | Recomendadas por generos | `fetchRecommendedMovies(movie)` |

### Modelo `Movie`

`id`, `title`, `description`, `year`, `image_url`, `genre: string[]`, `stars`

## Componentes clave

| Componente | Responsabilidad |
|---|---|
| `MoviesScreen` | Home: carga catalogo, hero, carruseles |
| `HeroBanner` | Pelicula destacada con parallax y gradiente |
| `MovieCarousel` | Carrusel horizontal; prop `size` opcional (`DEFAULT_CAROUSEL_SIZE`) |
| `MovieDetail` | Detalle + recomendadas por genero |
| `SplashLoading` | Splash animado al cargar |

## Reglas de implementacion

- Responder siempre en espanol, tecnico y sin relleno.
- Priorizar cambios pequenos, claros y listos para produccion.
- Escribir solo lo necesario; reutilizar utilidades existentes (`stars.ts`, `routes.ts`, `parseMovieList`).
- Cada funcion o componente nuevo debe llevar un comentario de linea que indique su proposito.
- No crear componentes huérfanos; eliminar codigo que deje de usarse.
- Pantallas en `src/components/`; rutas delgadas en `app/` (re-export o default export).
