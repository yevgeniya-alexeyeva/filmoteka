import MovieFilter from '../API/fetchFilter';
import PopularFilms from '../API/fetchPopular';
import refs from '../js/refs';
import createMarkup from '../templates/galleryCard.hbs';
import Search from './spinner';
import transformMovieObject from './transformMovieObject';
import Pagination from './pagination-api';
import {
  showPrevPopPage,
  showNextPopPage,
  showSelectedPopPage,
} from './popular-gallery';
import {
  showPrevSearchPage,
  showNextSearchPage,
  showSelectedSearchPage,
} from './search';

const spinner = new Search();
const movieFilter = new MovieFilter();
const fetchPopularMovie = new PopularFilms();
const pagination = new Pagination();

yearPickerMenu();

let yearValue = '';
let genreValue = '';

refs.filterInput.forEach(item => {
  item.addEventListener('change', event => {
    movieFilter.resetPage();
    refs.searchInput.value = '';
    yearValue = refs.yearPicker.value;
    genreValue = refs.genrePicker.value;
    createCard(genreValue, yearValue);
  });
});

let lastPage;

function createCard(genre, year) {
  movieFilter.fetchMovies(genre, year).then(res => {
    scrollWin();
    lastPage = res.total_pages;
    spinner.showSpinner();
    refs.gallery.innerHTML = createMarkup(transformMovieObject(res.results));
    // pagination
    if (res.total_results > 20) {
      refs.paginationPrevButton.classList.remove('hidden');
      refs.paginationNextButton.classList.remove('hidden');

      refs.paginationPrevButton.removeEventListener('click', showPrevPopPage);
      refs.paginationNextButton.removeEventListener('click', showNextPopPage);
      refs.paginationWrapper.removeEventListener('click', showSelectedPopPage);

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

      refs.paginationPrevButton.addEventListener('click', showPrevFilterPage);
      refs.paginationNextButton.addEventListener('click', showNextFilterPage);
      refs.paginationWrapper.addEventListener('click', showSelectedFilterPage);
      refs.paginationWrapper.innerHTML = pagination.renderPaginationMarkup(
        movieFilter.page,
        res.total_results,
      );
    } else {
      // refs.paginationWrapper.innerHTML = null;
      refs.paginationPrevButton.classList.add('hidden');
      refs.paginationNextButton.classList.add('hidden');
    }
    spinner.hideSpinner();
  });
}

function scrollWin() {
  window.scrollTo(0, 230);
}

//pagination callbacks
const showPrevFilterPage = () => {
  if (movieFilter.page < 2) return;
  movieFilter.decrementPage();
  createCard(genreValue, yearValue);
};
const showNextFilterPage = () => {
  const activePageNumber = document.querySelector('li.active');
  if (lastPage === +activePageNumber.textContent) return;
  movieFilter.incrementPage();
  createCard(genreValue, yearValue);
};
const showSelectedFilterPage = e => {
  if (e.target.nodeName === 'LI') {
    if (isNaN(e.target.textContent)) return;
    movieFilter.page = e.target.textContent;
    createCard(genreValue, yearValue);
  }
};

function yearPickerMenu() {
  let startYear = 1900;
  let endYear = new Date().getFullYear();
  let years = [];

  refs.yearPicker.insertAdjacentHTML(
    'beforeend',
    '<option value="">Choose year</option>',
  );
  for (let i = endYear; i > startYear; i--) {
    years.push(`<option value="${i}">${i}</option>`);
  }
  refs.yearPicker.insertAdjacentHTML('beforeend', years);
}
export { showPrevFilterPage, showNextFilterPage, showSelectedFilterPage };
