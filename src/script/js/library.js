import refs from './refs';
import createCard from './popular-gallery';
import hendlerInput from './search';
import FilmsStorage from './local-storage';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import FireStorage from './firestorage';

const filmsStorage = new FilmsStorage();

const {
  homeBtn,
  libraryBtn,
  headerBg,
  searchWrap,
  searchInputRef,
  libraryBtnsContainer,
  gallery,
  paginationContainer,
  filter,
  watchedBtn,
  queueBtn,
  yearPicker,
  genrePicker,
} = refs;

homeBtn.addEventListener('click', e => hendlerHomeBtn(e));
libraryBtn.addEventListener('click', e => hendlerLibraryBtn(e));

export default function hendlerHomeBtn(e) {
  libraryBtn.disabled = false;
  homeBtn.disabled = true;
  watchedBtn.disabled = false;
  queueBtn.disabled = false;

  headerBg.classList.remove('library__background');
  libraryBtn.classList.remove('current');
  homeBtn.classList.add('current');
  searchWrap.classList.remove('visually-hidden');
  libraryBtnsContainer.classList.add('visually-hidden');
  filter.classList.remove('visually-hidden');
  searchInputRef.value = '';
  createCard();
  paginationContainer.classList.remove('visually-hidden');
  for (let i = 0; i < btns.length; i++) {
    const current = libraryBtnsContainer.getElementsByClassName('activeBtn');
    if (current.length > 0) {
      current[i].classList.remove('activeBtn');
    }
  }
  yearPicker.value = '';
  genrePicker.value = '';
}

function hendlerLibraryBtn(e) {
  libraryBtn.disabled = true;
  homeBtn.disabled = false;
  watchedBtn.disabled = true;
  queueBtn.disabled = false;

  homeBtn.classList.remove('current');
  libraryBtn.classList.add('current');
  watchedBtn.classList.add('activeBtn');
  headerBg.classList.add('library__background');
  searchWrap.classList.add('visually-hidden');
  libraryBtnsContainer.classList.remove('visually-hidden');
  filter.classList.add('visually-hidden');
  gallery.innerHTML = '';

  const user = firebase.auth().currentUser;
  const firestorage = new FireStorage(user);
  const watchedClickBtn = () => {
    firestorage.getWatchedFromStorage().then(res => {
      firestorage.showWatched(res);
    });
  };
  const queueClickBtn = () => {
    firestorage.getQueueFromStorage().then(res => {
      firestorage.showQueue(res);
    });
  };
  if (user) {
    firestorage.getWatchedFromStorage().then(res => {
      firestorage.showWatched(res);
    });
    watchedBtn.removeEventListener('click', filmsStorage.showWatchedFilms);
    queueBtn.removeEventListener('click', filmsStorage.showFilmsQueue);

    watchedBtn.addEventListener('click', watchedClickBtn);
    queueBtn.addEventListener('click', queueClickBtn);
  } else {
    filmsStorage.showWatchedFilms();
    watchedBtn.removeEventListener('click', watchedClickBtn);
    queueBtn.removeEventListener('click', queueClickBtn);
    watchedBtn.addEventListener('click', filmsStorage.showWatchedFilms);
    queueBtn.addEventListener('click', filmsStorage.showFilmsQueue);
  }


  // watchedBtn.classList.add('activeBtn');
  
  paginationContainer.classList.add('visually-hidden');
}

const btns = libraryBtnsContainer.getElementsByClassName('button');

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', function () {
    const current = libraryBtnsContainer.getElementsByClassName(' activeBtn');

    if (current.length > 0) {
      current[0].className = current[0].className.replace(' activeBtn', '');
    }

    this.className += ' activeBtn';
  });
}
