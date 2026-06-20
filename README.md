# Movies App

Aplicación móvil de películas construida con React Native y Expo.  
Consume la API de [DevsApiHub](https://devsapihub.com/docs/api-movies) para mostrar un catálogo dinámico con hero destacado, carruseles horizontales y diseño responsivo.  
La UI está desarrollada con NativeWind (Tailwind CSS) y animaciones con Reanimated.  
Incluye splash animado, filtros visuales en el hero y secciones como Populares, Mejor calificadas y Acción.

## Demo

<p align="center">
  <img src="./demo/1.png" alt="Movies App - Hero y carruseles" width="45%" />
  <img src="./demo/2.png" alt="Movies App - Vista de películas" width="45%" />
</p>

## Cómo correr el proyecto

### Requisitos

- Node.js 20+
- npm
- Expo Go (dispositivo físico) o emulador Android/iOS

### Instalación

```bash
git clone https://github.com/urian121/movies-app-react-native
cd movies-app-react-native
npm install
```

### Variables de entorno

Copia el archivo de ejemplo y configura la URL de la API:

```bash
cp .env-example .env
```

Contenido de `.env`:

```env
EXPO_PUBLIC_MOVIE_URL=https://devsapihub.com/api-movies
```

### Ejecutar

```bash
npx expo start
```

Luego presiona `a` para Android, `i` para iOS o escanea el QR con Expo Go.

También puedes usar:

```bash
npm run android
npm run ios
npm run web
```

## Apoya el proyecto

Si este proyecto te fue útil, apóyanos dejando una estrella en el repositorio.  
Eso nos ayuda a seguir mejorando la app y publicar más contenido.  
¡Gracias por tu apoyo!
