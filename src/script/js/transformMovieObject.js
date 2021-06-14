import FetchGenre from '../API/fetchGenre';
import CONST from '../API/settings';

const apiGenreData = new FetchGenre();
const { reservImg } = CONST;

export default function transformMovieObject(movies) {
  movies.forEach(elem => {
    if (elem.title.length > 38) {
      elem.title = elem.title.slice(0, 38) + '...';
    }
    elem.poster_path
      ? (elem.poster_path = `https://image.tmdb.org/t/p/w500/${elem.poster_path}`)
      : (elem.poster_path = reservImg);
    elem.release_date
      ? (elem.release_date = elem.release_date.slice(0, 4))
      : (elem.release_date = 'Unknown');
    if (elem.genre_ids.length > 0) {
      elem.genre_ids = apiGenreData
        .ganreTranspiler(elem.genre_ids)
        .slice(0, 3)
        .join(', ');
    } else {
      elem.genre_ids = 'Unknown';
    }
  });
  return movies;
}
