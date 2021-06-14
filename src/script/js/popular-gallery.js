import PopularFilms from '../API/fetchPopular';
import refs from '../js/refs';
import createMarkup from '../templates/galleryCard.hbs';
import Pagination from './pagination-api';
import transformMovieObject from './transformMovieObject';
import Search from './spinner';
import {
  showPrevFilterPage,
  showNextFilterPage,
  showSelectedFilterPage,
} from './movieFilter';
import {
  showPrevSearchPage,
  showNextSearchPage,
  showSelectedSearchPage,
} from './search';

const fetchPopularMovie = new PopularFilms();
const pagination = new Pagination();

const spinner = new Search();

let lastPage;

function createCard() {
  spinner.showSpinner();
  fetchPopularMovie
    .fetchPopular()
    .then(res => {
      scrollWin();

      lastPage = res.total_pages;

      refs.gallery.innerHTML = createMarkup(transformMovieObject(res.results));
      // pagination
      if (res.total_results > 20) {
        refs.paginationPrevButton.classList.remove('hidden');
        refs.paginationNextButton.classList.remove('hidden');

        refs.paginationPrevButton.removeEventListener(
          'click',
          showPrevFilterPage,
        );
        refs.paginationNextButton.removeEventListener(
          'click',
          showNextFilterPage,
        );
        refs.paginationWrapper.removeEventListener(
          'click',
          showSelectedFilterPage,
        );

        refs.paginationPrevButton.removeEventListener(
          'click',
          showPrevSearchPage,
        );
        refs.paginationNextButton.removeEventListener(
          'click',
          showNextSearchPage,
        );
        refs.paginationWrapper.removeEventListener(
          'click',
          showSelectedSearchPage,
        );

        refs.paginationPrevButton.addEventListener('click', showPrevPopPage);
        refs.paginationNextButton.addEventListener('click', showNextPopPage);
        refs.paginationWrapper.addEventListener('click', showSelectedPopPage);
        refs.paginationWrapper.innerHTML = pagination.renderPaginationMarkup(
          fetchPopularMovie.page,
          res.total_results,
        );
      } else {
        refs.paginationWrapper.innerHTML = null;
        refs.paginationPrevButton.classList.add('hidden');
        refs.paginationNextButton.classList.add('hidden');
      }
      spinner.hideSpinner();
    })
    .catch(error => console.log(console.error()));
}
fetchPopularMovie.resetPage();
createCard();

const showPrevPopPage = () => {
  if (fetchPopularMovie.page < 2) return;
  fetchPopularMovie.decrementPage();
  createCard();
};
const showNextPopPage = () => {
  const activePageNumber = document.querySelector('li.active');

  if (lastPage === +activePageNumber.textContent) return;

  fetchPopularMovie.incrementPage();

  createCard();
};
const showSelectedPopPage = e => {
  if (e.target.nodeName === 'LI') {
    if (isNaN(e.target.textContent)) return;
    fetchPopularMovie.page = e.target.textContent;
    createCard();
  }
};
function scrollWin() {
  window.scrollTo(0, 230);
}

export default createCard;
export { showPrevPopPage, showNextPopPage, showSelectedPopPage };
