// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

import Notiflix from 'notiflix';

import NewsService from './API.js';

import LoadMoreBtn from './components/LoadMoreBtn.js';


const refs = {
  searchForm: document.getElementById('search-form'),
  searchQueryInput: document.querySelector('.input'),
  SearchButton: document.querySelector('.button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const newsService = new NewsService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMore',
  isHidden: true,
});

refs.searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (value === '') alert('No value!');
  else {
    newsService.searchQuery = value;
    newsService.resetPage();

    loadMoreBtn.show();
    clearNewsList();
    fetchArticles().finally(() => form.reset());
  }
}

async function fetchArticles() {
  loadMoreBtn.disable();
  try {
    const markup = await getArticlesMarkup();
    if (!markup) throw new Error(data);
    updateNewsList(markup);
  } catch (err) {
    onError(err);
  }

  loadMoreBtn.enable();
}

async function getArticlesMarkup() {
  try {
    const articles = await newsService.getNews();
    Notiflix.Notify.success(`"Hooray! We found ${articles.totalHits} images.`);
    const base = articles.hits;

    if (!base) {
      loadMoreBtn.hide();
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (base.length === 0) throw new Error(data);

    return base.reduce((markup, article) => markup + createMarkup(article), '');
  } catch (err) {
    onError(err);
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
  <img src="${webformatURL}" class="image" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}

function updateNewsList(markup) {
  
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearNewsList() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  loadMoreBtn.hide();
  refs.gallery.innerHTML = '<p>Not found!</p>';
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchArticles();
  }
}

window.addEventListener('scroll', handleScroll);
