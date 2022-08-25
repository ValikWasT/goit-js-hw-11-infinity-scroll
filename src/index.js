import ApiByName from './js/fetchByName';
import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
const search = new ApiByName();
let hitsCount = 0;
const refs = {
  formInput: document.querySelector('form > input'),
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMore.addEventListener('click', onLoadMoreBtnClick);

function onLoadMoreBtnClick() {
  refs.loadMore.classList.add('is-hidden');
  search
    .searchByName()
    .then(r => {
      if (hitsCount >= r.totalHits) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        return;
      }
      onSuccess(r);
      hitsCount += r.hits.length;
      Notiflix.Notify.info(`Hooray! We found ${r.totalHits} images.`);
      search.page += 1;
      refs.loadMore.classList.remove('is-hidden');
      if (hitsCount >= r.totalHits) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMore.classList.add('is-hidden');
      }
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => console.log(error));
}

function onSubmitForm(e) {
  e.preventDefault();
  refs.loadMore.classList.add('is-hidden');
  const inputValue = refs.formInput.value.trim();
  search.searchQuery = inputValue;
  refs.gallery.innerHTML = '';
  search.page = 1;
  search
    .searchByName()
    .then(r => {
      if (r.total === 0) {
        onError();
        return;
      }

      onSuccess(r);
      hitsCount = r.hits.length;
      Notiflix.Notify.info(`Hooray! We found ${r.totalHits} images.`);
      search.page += 1;
      refs.loadMore.classList.remove('is-hidden');
    })
    .catch(error => Notiflix.Notify.failure('Error!'));
}

function onError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onSuccess(r) {
  const photosToGallery = r.hits
    .map(
      photo => `<div class="photo-card">
  <a href="${photo.largeImageURL}"><img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${photo.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${photo.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${photo.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${photo.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', photosToGallery);
  lightbox.refresh();
}

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// const cardHeight = refs.gallery.firstElementChild;
// console.log(cardHeight);
