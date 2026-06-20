// Define el contrato normalizado de pelicula para usar en la app.
export interface Movie {
  id: number;
  title: string;
  description: string;
  year: number;
  image_url: string;
  genre: string[];
  stars: number;
}

// Define el contrato crudo que puede regresar la API.
export interface MovieApiItem {
  id?: number;
  title?: string;
  description?: string;
  year?: number;
  image_url?: string;
  genre?: string[];
  stars?: number;
}
