import refs from './refs';
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import PNotify from '../../../node_modules/pnotify/dist/es/PNotify.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD5Lz8Xolb4aTDugqG9oqiD3TvNrCFheKg',
  authDomain: 'filmoteka-d2783.firebaseapp.com',
  projectId: 'filmoteka-d2783',
  storageBucket: 'filmoteka-d2783.appspot.com',
  messagingSenderId: '870527658773',
  appId: '1:870527658773:web:6c74f3043e4340ced1d71c',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default class FireStorage {
  constructor(user) {
    this._watched = [];
    this._queue = [];
    this.user = user;
  }
  get watched() {
    return this._watched;
  }
  get queue() {
    return this._queue;
  }
  addToWatchedList(item) {
    this._watched.push(item);
    this.saveWatchedFilms();
    if (refs.libraryBtn.disabled && refs.watchedBtn.disabled)
      this.showWatched(this._watched);
  }
  removeFromWathedList(index) {
    this._watched.splice(index, 1);
    this.saveWatchedFilms();
    if (refs.libraryBtn.disabled && refs.watchedBtn.disabled)
      this.showWatched(this._watched);
  }

  saveWatchedFilms() {
    db.collection('users')
      .doc(this.user.uid)
      .collection('Watched')
      .doc('Markup')
      .set({ list: JSON.stringify(this._watched) });
  }
  async getWatchedFromStorage() {
    const data = await db
      .collection('users')
      .doc(this.user.uid)
      .collection('Watched')
      .doc('Markup')
      .get();
    if (data.data()) {
      const savedFilms = data.data().list;
      if (!savedFilms) {
        PNotify.info({
          text: 'Your watchedlist is empty.',
          delay: 1000,
        });
        refs.gallery.innerHTML = null;
        return;
      }
      JSON.parse(savedFilms).forEach(object => {
        this._watched.push(object);
      });
      return JSON.parse(savedFilms);
    }
  }
  showWatched(films) {
    refs.watchedBtn.disabled = true;
    refs.queueBtn.disabled = false;
    let watchedFilmsMarkup = '';
    films.forEach(object => {
      watchedFilmsMarkup +=
        '<li class="movies__list-item">' + object.element + '</li>';
    });
    refs.gallery.innerHTML = watchedFilmsMarkup;
  }
  addToQueueList(item) {
    this._queue.push(item);
    this.saveQueueFilms();
    if (refs.libraryBtn.disabled && refs.queueBtn.disabled)
      this.showQueue(this._queue);
  }
  removeFromQueueList(index) {
    this._queue.splice(index, 1);
    this.saveQueueFilms();
    if (refs.libraryBtn.disabled && refs.queueBtn.disabled)
      this.showQueue(this._queue);
  }

  saveQueueFilms() {
    db.collection('users')
      .doc(this.user.uid)
      .collection('Queue')
      .doc('Markup')
      .set({ list: JSON.stringify(this._queue) });
  }
  async getQueueFromStorage() {
    const data = await db
      .collection('users')
      .doc(this.user.uid)
      .collection('Queue')
      .doc('Markup')
      .get();
    if (data.data()) {
      const savedFilms = data.data().list;
      if (!savedFilms) {
        PNotify.info({
          text: 'Your watchedlist is empty.',
          delay: 1000,
        });
        refs.gallery.innerHTML = null;
        return;
      }
      JSON.parse(savedFilms).forEach(object => {
        this._queue.push(object);
      });
      return JSON.parse(savedFilms);
    }
  }
  showQueue(films) {
    refs.queueBtn.disabled = true;
    refs.watchedBtn.disabled = false;
    let queueFilmsMarkup = '';
    films.forEach(object => {
      queueFilmsMarkup +=
        '<li class="movies__list-item">' + object.element + '</li>';
    });
    refs.gallery.innerHTML = queueFilmsMarkup;
  }
}
