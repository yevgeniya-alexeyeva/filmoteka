import refs from './refs';
import FetchSearchMovie from '../API/fetchSearchMovie';
import Pagination from './pagination-api';
import createMarkup from '../templates/galleryCard.hbs';
import Search from './spinner';
import _debounce from 'lodash.debounce';
import transformMovieObject from './transformMovieObject';
import {
  showPrevPopPage,
  showNextPopPage,
  showSelectedPopPage,
} from './popular-gallery';
import {
  showPrevFilterPage,
  showNextFilterPage,
  showSelectedFilterPage,
} from './movieFilter';

const {
  searchInputRef,
  gallery,
  noResultRef,
  paginationWrapper,
  paginationPrevButton,
  paginationNextButton,
  paginationContainer,
  searchWrap,
  genrePicker,
  yearPicker,
} = refs;

const apiSearchData = new FetchSearchMovie();
const pagination = new Pagination();
const spinner = new Search();

let lastPage;

searchInputRef.addEventListener(
  'input',
  _debounce(e => {
    let targetValue = e.target.value;
    handlerInput(targetValue);
  }, 500),
);

function handlerInput(e) {
  apiSearchData.query = e;
  genrePicker.value = '';
  yearPicker.value = '';
  if (searchInputRef.value === '') {
    searchWrap.classList.remove('without-after-el');
    return;
  }
  searchWrap.classList.add('without-after-el');
  apiSearchData.resetPage();
  createCard();
}

function createCard() {
  apiSearchData
    .fetchMovies()
    .then(res => {
      scrollWin();
      spinner.showSpinner();
      if (res === []) return;
      gallery.innerHTML = createMarkup(transformMovieObject(res.results));
      // pagination

      lastPage = res.total_pages;

      if (res.total_pages > 1) {
        noResultRef.textContent = '';
        paginationContainer.classList.remove('visually-hidden');
        paginationPrevButton.classList.remove('hidden');
        paginationNextButton.classList.remove('hidden');

        paginationPrevButton.removeEventListener('click', showPrevPopPage);
        paginationNextButton.removeEventListener('click', showNextPopPage);
        paginationWrapper.removeEventListener('click', showSelectedPopPage);

        paginationPrevButton.removeEventListener('click', showPrevFilterPage);
        paginationNextButton.removeEventListener('click', showNextFilterPage);
        paginationWrapper.removeEventListener('click', showSelectedFilterPage);

        paginationPrevButton.addEventListener('click', showPrevSearchPage);
        paginationNextButton.addEventListener('click', showNextSearchPage);
        paginationWrapper.addEventListener('click', showSelectedSearchPage);
        paginationWrapper.innerHTML = pagination.renderPaginationMarkup(
          apiSearchData.page,
          res.total_results,
        );
      } else {
        paginationWrapper.innerHTML = null;
        paginationPrevButton.classList.add('hidden');
        paginationNextButton.classList.add('hidden');
      }
      if (res.total_results === 0 || res.total_results === '') {
        noResults();
        paginationContainer.classList.add('visually-hidden');
      }
      spinner.hideSpinner();
    })
    .catch(e => console.log(e));
}

function noResults() {
  noResultRef.textContent =
    'Search result not successful. Enter the correct movie name and try again';
  setTimeout(function () {
    noResultRef.textContent = '';
  }, 2000);
}

const showPrevSearchPage = () => {
  if (apiSearchData.page < 2) return;
  apiSearchData.decrementPage();
  createCard();
};
const showNextSearchPage = () => {
  const activePageNumber = document.querySelector('li.active');
  if (lastPage === +activePageNumber.textContent) return;
  apiSearchData.incrementPage();
  createCard();
};
const showSelectedSearchPage = e => {
  if (e.target.nodeName === 'LI') {
    if (isNaN(e.target.textContent)) return;
    apiSearchData.page = e.target.textContent;
    createCard();
  }
};
function scrollWin() {
  window.scrollTo(0, 0);
}

export default handlerInput;
export { showPrevSearchPage, showNextSearchPage, showSelectedSearchPage };
