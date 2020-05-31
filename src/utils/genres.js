export const getTopGenres = (genres) => {
  let start = {};
  const repeat = {};

  for (const genre of genres) {
    start = genre;
    if (repeat[start]) {
      repeat[start] += 1;
    } else {
      repeat[start] = 1;
    }
  }

  const sortGenresByIndex = Object.entries(repeat).sort((a, b) => b[1] - a[1]);
  const topGenres = sortGenresByIndex.map((genre) => genre[0]);

  return {
    topGenres,
    topGenre: topGenres[0],
    sortGenresByIndex,
  };
};
