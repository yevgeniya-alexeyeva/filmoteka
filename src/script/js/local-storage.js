import refs from './refs';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import PNotify from '../../../node_modules/pnotify/dist/es/PNotify.js';

export default class FilmsStorage {
  constructor() {
    this._watchedFilms = [];
    this._filmsQueue = [];
    this.refreshData();
  }
  refreshData() {
    if (localStorage.getItem('films-queue')) {
      this._filmsQueue = JSON.parse(localStorage.getItem('films-queue'));
    }
    if (localStorage.getItem('watched-films')) {
      this._watchedFilms = JSON.parse(localStorage.getItem('watched-films'));
    }
  }
  //watched
  addToWatchedFilm(item) {
    this._watchedFilms.push(item);
    this.saveWatchedFilms();
    if (refs.libraryBtn.disabled && refs.watchedBtn.disabled)
      this.showWatchedFilms();
  }
  removeWathedFilm(index) {
    this._watchedFilms.splice(index, 1);
    this.saveWatchedFilms();
    if (refs.libraryBtn.disabled && refs.watchedBtn.disabled)
      this.showWatchedFilms();
  }
  saveWatchedFilms() {
    localStorage.setItem('watched-films', JSON.stringify(this._watchedFilms));
  }
  showWatchedFilms() {
    const savedFilms = localStorage.getItem('watched-films');
    refs.watchedBtn.disabled = true;
    refs.queueBtn.disabled = false;
    if (!savedFilms) {
      PNotify.info({
        text: 'Your watchedlist is empty.',
        delay: 1000,
      });
      refs.gallery.innerHTML = null;
      return;
    }
    let watchedFilmsMarkup = '';
    JSON.parse(savedFilms).forEach(object => {
      watchedFilmsMarkup +=
        '<li class="movies__list-item">' + object.element + '</li>';
    });

    refs.gallery.innerHTML = watchedFilmsMarkup;
  }
  getWathedListFromLS() {
    if (!localStorage.getItem('watched-films')) return;
    this._watchedFilms = JSON.parse(localStorage.getItem('watched-films'));
  }
  get watchedFilms() {
    return this._watchedFilms;
  }

  //queue
  addToQueue(item) {
    this._filmsQueue.push(item);
    this.saveFilmsQueue();
    if (refs.libraryBtn.disabled && refs.queueBtn.disabled)
      this.showFilmsQueue();
  }
  removeFromQueue(index) {
    this._filmsQueue.splice(index, 1);
    this.saveFilmsQueue();
    if (refs.libraryBtn.disabled && refs.queueBtn.disabled)
      this.showFilmsQueue();
  }
  saveFilmsQueue() {
    localStorage.setItem('films-queue', JSON.stringify(this._filmsQueue));
  }
  showFilmsQueue() {
    const queue = localStorage.getItem('films-queue');
    refs.queueBtn.disabled = true;
    refs.watchedBtn.disabled = false;
    if (!queue) {
      PNotify.info({
        text: 'Your queue is empty.',
        delay: 1000,
      });
      refs.gallery.innerHTML = null;
      return;
    }
    let filmsQueueMarkup = '';
    JSON.parse(queue).forEach(object => {
      filmsQueueMarkup +=
        '<li class="movies__list-item">' + object.element + '</li>';
    });

    refs.gallery.innerHTML = filmsQueueMarkup;
  }
  getQueueFromLS() {
    if (!localStorage.getItem('films-queue')) return;
    this._filmsQueue = JSON.parse(localStorage.getItem('films-queue'));
  }
  get filmsQueue() {
    return this._filmsQueue;
  }
}
