import settings from './settings';
const BASE_URL = settings.BASE_URL;
const API_KEY = settings.API_KEY;

export default class PopularFilms {
  constructor() {
    this._page = 1;
    this.result;
  }
  async fetchPopular() {
    const response = await fetch(
      `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&page=${this._page}`,
    );
    return response.json();
  }

  incrementPage() {
    this._page = +this._page + 1;
  }
  resetPage() {
    this._page = 1;
  }
  decrementPage() {
    this._page = +this._page - 1;
  }
  get page() {
    return this._page;
  }
  set page(value) {
    this._page = value;
  }
}
