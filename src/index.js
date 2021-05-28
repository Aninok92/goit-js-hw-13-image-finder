import ImagesApiService from './js/apiService';
import photoCardTml from './templates/photo-card.hbs';
import './css/style.css';
import { info } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import 'spin.js/spin.css';
import { Spinner } from 'spin.js';
import opts from './js/options';

const imagesApiService = new ImagesApiService();

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
  imagesApiService.query = e.currentTarget.elements.query.value;
  if (imagesApiService.query === '') {
    PNotify();
  }
  imagesApiService.resetPage();
  imagesApiService
    .fetchPhotoCards()
    .then(appendPhotoCardsMarcup)
    .catch(error => console.error(error));
}

function onLoadMore() {
  imagesApiService
    .fetchPhotoCards()
    .then(appendPhotoCardsMarcup)
    .then(scroll)
    .catch(error => console.error(error));
}

function appendPhotoCardsMarcup(hits) {
  refs.photoCardsContainer.insertAdjacentHTML('beforeend', photoCardTml(hits));
}

refs.photoCardsContainer.addEventListener('click', onClick);

function onClick(e) {
  if (e.target.nodeName !== 'IMG') return;
  const largeimage = e.target.dataset.source;
  const lightBox = basicLightbox.create(
    `
    <img src="${largeimage}"  width="600">

    <div id="spinner-root"></div>
`,
  );
  lightBox.show();

  const spinnerRoot = lightBox.element().querySelector('#spinner-root');
  console.log(spinnerRoot);
  const spinner = new Spinner(opts).spin(spinnerRoot);

  const imgElement = lightBox.element().querySelector('img');
  imgElement.addEventListener('load', () => spinner.stop());
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
