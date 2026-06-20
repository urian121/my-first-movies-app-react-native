// Genera estrellas visuales segun la calificacion de la pelicula.
export const renderStars = (stars: number) => {
  const filled = Math.round(stars);
  return "★".repeat(filled) + "☆".repeat(Math.max(0, 5 - filled));
};
