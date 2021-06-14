import Lightbox from './lightbox';
import refs from './refs';
import runTrailer from '../API/fetchTrailer';
import settings from '../API/settings';
import MovieApi from '../API/fetchMovie';
import movieCard from '../templates/movieCard.hbs';
import FilmsStorage from './local-storage';
import FireStorage from './firestorage';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';

const { reservImg } = settings;
const { gallery } = refs;
const movieInfo = new MovieApi();
const lightbox = new Lightbox();
const filmsStorage = new FilmsStorage();
let firestorage = null;
gallery.addEventListener('click', event => lightbox.openLightbox(event));

const createMarkup = function (event) {
  movieInfo.fetchMovie(event.target.id).then(result => {
    result.poster_path
      ? (result.poster_path = `https://image.tmdb.org/t/p/w500/${result.poster_path}`)
      : (result.poster_path = reservImg);
    const genres = result.genres.map(item => item.name);
    result.genres = genres.join(', ');
    result.popularity = parseFloat(result.popularity).toFixed(1);
    lightbox.refs.infoCard.insertAdjacentHTML('beforeend', movieCard(result));

    const curElement = {
      id: event.target.id,
      element: event.target.parentNode.innerHTML,
    };
    const addToWathedBtn = document.querySelector('.modal-button-watched');
    const addToQueueBtn = document.querySelector('.modal-button-queue');
    //watched
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const firestorage = new FireStorage(user);
        firestorage.getWatchedFromStorage().then(result => {
          if (result && result.some(element => element.id === curElement.id)) {
            addToWathedBtn.classList.add('ableToRemove');
            addToWathedBtn.textContent = 'remove from viewed';
          } else {
            addToWathedBtn.classList.add('ableToAdd');
            addToWathedBtn.textContent = 'add to watched';
          }
        });
        addToWathedBtn.addEventListener('click', watchedBtnHandler);
        function watchedBtnHandler() {
          if (addToWathedBtn.classList.contains('ableToAdd')) {
            firestorage.addToWatchedList(curElement);
            addToWathedBtn.classList.replace('ableToAdd', 'ableToRemove');
            addToWathedBtn.textContent = 'remove from viewed';
          } else {
            const index = firestorage.watched.findIndex(
              film => film.id === curElement.id,
            );
            firestorage.removeFromWathedList(index);
            addToWathedBtn.classList.replace('ableToRemove', 'ableToAdd');
            addToWathedBtn.textContent = 'add to watched';
          }
        }
        firestorage.getQueueFromStorage().then(result => {
          if (result && result.some(element => element.id === curElement.id)) {
            addToQueueBtn.classList.add('ableToRemove');
            addToQueueBtn.textContent = 'remove from queue';
          } else {
            addToQueueBtn.classList.add('ableToAdd');
            addToQueueBtn.textContent = 'add to queue';
          }
        });
        addToQueueBtn.addEventListener('click', queueBtnHandler);
        function queueBtnHandler() {
          if (addToQueueBtn.classList.contains('ableToAdd')) {
            firestorage.addToQueueList(curElement);
            addToQueueBtn.classList.replace('ableToAdd', 'ableToRemove');
            addToQueueBtn.textContent = 'remove from queue';
            console.log(firestorage);
          } else {
            const index = firestorage.queue.findIndex(
              film => film.id === curElement.id,
            );
            firestorage.removeFromQueueList(index);
            addToQueueBtn.classList.replace('ableToRemove', 'ableToAdd');
            addToQueueBtn.textContent = 'add to queue';
          }
        }
      } else {
        if (
          filmsStorage.watchedFilms.length &&
          filmsStorage.watchedFilms.some(
            element => element.id === curElement.id,
          )
        ) {
          addToWathedBtn.classList.add('ableToRemove');
          addToWathedBtn.textContent = 'remove from viewed';
        } else {
          addToWathedBtn.classList.add('ableToAdd');
          addToWathedBtn.textContent = 'add to watched';
        }
        const watchedBtnHandler = () => {
          if (addToWathedBtn.classList.contains('ableToAdd')) {
            filmsStorage.addToWatchedFilm(curElement);
            addToWathedBtn.classList.replace('ableToAdd', 'ableToRemove');
            addToWathedBtn.textContent = 'remove from viewed';
          } else {
            const index = filmsStorage.watchedFilms.findIndex(
              film => film.id === curElement.id,
            );
            filmsStorage.removeWathedFilm(index);

            addToWathedBtn.classList.replace('ableToRemove', 'ableToAdd');
            addToWathedBtn.textContent = 'add to watched';
          }
        };
        addToWathedBtn.addEventListener('click', watchedBtnHandler);
        if (
          filmsStorage.filmsQueue.length &&
          filmsStorage.filmsQueue.some(element => element.id === curElement.id)
        ) {
          addToQueueBtn.classList.add('ableToRemove');
          addToQueueBtn.textContent = 'remove from queue';
        } else {
          addToQueueBtn.classList.add('ableToAdd');
          addToQueueBtn.textContent = 'add to queue';
        }
        const queueBtnHandler = () => {
          if (addToQueueBtn.classList.contains('ableToAdd')) {
            filmsStorage.addToQueue(curElement);
            addToQueueBtn.classList.replace('ableToAdd', 'ableToRemove');
            addToQueueBtn.textContent = 'remove from queue';
          } else {
            const index = filmsStorage.filmsQueue.findIndex(
              film => film.id === curElement.id,
            );
            filmsStorage.removeFromQueue(index);
            addToQueueBtn.classList.replace('ableToRemove', 'ableToAdd');
            addToQueueBtn.textContent = 'add to queue';
          }
        };
        addToQueueBtn.addEventListener('click', queueBtnHandler);
      }
    });
    //trailer
    const trailerBtn = document.querySelector('.play-trailer');
    trailerBtn.addEventListener('click', event => {
      new runTrailer(event.target.dataset.id, event.target.dataset.name).show();
    });
  });
};
export default firestorage;
export { createMarkup };
