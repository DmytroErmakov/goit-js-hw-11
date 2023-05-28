import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36761808-85f8f6dd9a9f7c71c5d90744b';

export default class NewsService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  async getNews() {
    const data = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
      this.incrementPage();
      console.log(data.data); 
    return data.data;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}