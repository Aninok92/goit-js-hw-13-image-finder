import NewsApiService from './js/apiService';
import photoCardTml from './templates/photo-card.hbs';
import './css/style.css';
import { info } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import * as basicLightbox from 'basiclightbox';

const newsApiService = new NewsApiService();

const refs = {
  searchForm: document.querySelector('#search-form'),
  photoCardsContainer: document.querySelector('.js-photo-cards-container'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearPhotoCardsMarcup();
  refs.loadMoreBtn.classList.remove('is-hidden');
  newsApiService.query = e.currentTarget.elements.query.value;
  if (newsApiService.query === '') {
    PNotify();
  }
  newsApiService.resetPage();
  newsApiService.fetchPhotoCards().then(appendPhotoCardsMarcup);
}

function onLoadMore() {
  newsApiService.fetchPhotoCards().then(appendPhotoCardsMarcup).then(scroll);
}

function appendPhotoCardsMarcup(hits) {
  refs.photoCardsContainer.insertAdjacentHTML('beforeend', photoCardTml(hits));
}

refs.photoCardsContainer.addEventListener('click', onClick);

function onClick(e) {
  if (e.target.nodeName !== 'IMG') return;
  const largeimage = e.target.dataset.source;
  basicLightbox
    .create(
      `
    <img src="${largeimage}">
`,
    )
    .show();
}

function clearPhotoCardsMarcup() {
  refs.photoCardsContainer.innerHTML = '';
}

function scroll() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });
}

function PNotify() {
  info({
    title: false,
    text: 'Is empty',
    hide: true,
    icon: false,
    delay: 500,
  });
}
