import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let searchQuery = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.elements['search-text'].value.trim();
  if (!searchQuery) return;

  page = 1; // Сбрасываем страницу
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    // Если картинок больше 15, показываем кнопку
    if (totalHits <= 15) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
    form.reset();
  }
}

async function handleLoadMore() {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    createGallery(data.hits);

    // Плавный скролл страницы по ТЗ
    smoothScroll();

    // Проверяем, не дошли ли до конца коллекции
    const totalLoaded = page * 15;
    if (totalLoaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({ message: 'Failed to load more images.' });
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (firstCard) {
    const { height: cardHeight } = firstCard.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2, // Прокрутка строго на две высоты карточки
      behavior: 'smooth',
    });
  }
}
