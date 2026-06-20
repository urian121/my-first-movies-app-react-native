# AGENTS.md — App Movies

## Contexto del proyecto

- App: `my-movies-app` (React Native + Expo).
- UI: usar siempre [NativeWind](https://www.nativewind.dev/).
- HTTP: usar siempre `axios`.
- Estado global: usar `zustand` cuando se requiera estado compartido.

## API de películas

- Documentación: `https://devsapihub.com/docs/api-movies`.
- Base URL (env): `EXPO_PUBLIC_MOVIE_URL=https://devsapihub.com/api-movies`.
- Mantener tipado con interfaces para mapear respuestas de la API.
- Estructura principal de película: `id`, `title`, `description`, `year`, `image_url`, `genre`, `stars`.
- Endpoint base para listado inicial: `GET /api-movies`.
- Endpoint por id: `GET /api-movies/:id`.
- Endpoint por género: `GET /api-movies/genre/:genre`.

## Reglas de implementación

- Responder siempre en español, técnico y sin relleno.
- Priorizar cambios pequeños, claros y listos para producción.
- Escribir solo lo necesario, evitando duplicación de código.
- Cada función o componente nuevo debe llevar un comentario de línea que indique su propósito.