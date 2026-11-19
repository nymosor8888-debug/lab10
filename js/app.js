import { Album } from './album.js';
import { byPlace, searchByTitle, uniqueTags } from './photoTools.js';
import { PHOTOS } from './photos.js';
import { renderCards } from './render.js';
import { bindAddForm } from './form.js';

const album = Album.from(PHOTOS);
const state = { query: '', place: '' };

export function currentList() {
  let list = album.photos;
  if (state.place) list = byPlace(list, state.place);
  return searchByTitle(list, state.query);
}

const fillPlaces = () => {
  const select = document.querySelector('#place-filter');
  const places = [...new Set(album.photos.map((p) => p.place))];
  select.innerHTML =
    '<option value="">Бүх газар</option>' +
    places.map((pl) => `<option value="${pl}" ${pl === state.place ? 'selected' : ''}>${pl}</option>`).join('');
};

const rerender = () => {
  fillPlaces();
  renderCards(currentList());
};

document.querySelector('#cards').addEventListener('click', (e) => {
  const btn = e.target.closest('.like-btn');
  if (!btn) return;
  album.like(Number(btn.dataset.id));
  rerender();
});

document.querySelector('#search').addEventListener('input', (e) => {
  state.query = e.target.value;
  renderCards(currentList());
});

document.querySelector('#place-filter').addEventListener('change', (e) => {
  state.place = e.target.value;
  renderCards(currentList());
});

bindAddForm(document.querySelector('#add-form'), album, rerender);
rerender();
