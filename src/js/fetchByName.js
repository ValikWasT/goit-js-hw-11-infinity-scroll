export default class ApiByName {
  constructor() {
    this.searchQuery = '';
    this.page = '';
  }

  searchByName() {
    const API_KEY = '29456472-1a080d4a208e2467887aaa9a2';
    const BASE_URL = 'https://pixabay.com/api/';
    const axios = require('axios');
    return axios
      .get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      )
      .then(function (r) {
        return r.data;
      });
  }
}
