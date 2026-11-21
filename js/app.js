import { Album } from './album.js';
import { byPlace, searchByTitle, uniqueTags } from './photoTools.js';
import { PHOTOS } from './photos.js';
import { renderCards, renderTrashCards } from './render.js';
import { bindAddForm } from './form.js';
import { loadAlbum, saveAlbum } from './storage.js';

let album;
let trash = [];
const state = { query: '', place: '' };
const storageStatus = document.querySelector('#storage-status');

function showStorageError(message) {
  storageStatus.textContent = message;
  storageStatus.hidden = false;
}

function clearStorageError() {
  storageStatus.textContent = '';
  storageStatus.hidden = true;
}

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
  renderTrashCards(trash);
};

const persistAlbum = () => saveAlbum({ photos: album.toJSON(), trash });

const openImage = (imageButton) => {
  const dialog = document.querySelector('#image-dialog');
  document.querySelector('#dialog-image').src = imageButton.dataset.image;
  document.querySelector('#dialog-image').alt = imageButton.dataset.title;
  document.querySelector('#dialog-title').textContent = imageButton.dataset.title;
  dialog.showModal();
};

async function initialize() {
  try {
    const savedAlbum = await loadAlbum(PHOTOS);
    album = Album.from(savedAlbum.photos);
    trash = savedAlbum.trash;
  } catch (error) {
    album = Album.from(PHOTOS);
    trash = [];
    showStorageError('Хадгалсан зургуудыг ачаалж чадсангүй. Өөрчлөлт refresh хийсний дараа үлдэхгүй байж магадгүй.');
    console.error(error);
  }

  document.querySelector('#cards').addEventListener('click', async (e) => {
    const imageButton = e.target.closest('.image-btn');
    if (imageButton) {
      openImage(imageButton);
      return;
    }

    const deleteButton = e.target.closest('.delete-btn');
    if (deleteButton) {
      const id = Number(deleteButton.dataset.id);
      const photo = album.find(id);
      if (!photo || !window.confirm(`"${photo.title}" зургийг устгах уу?`)) return;

      album.remove(id);
      trash.push(photo);
      rerender();
      try {
        await persistAlbum();
        clearStorageError();
      } catch (error) {
        trash = trash.filter((p) => p.id !== id);
        album.add(photo);
        rerender();
        showStorageError('Зургийг устгаж хадгалж чадсангүй.');
        console.error(error);
      }
      return;
    }

    const btn = e.target.closest('.like-btn');
    if (!btn) return;
    album.like(Number(btn.dataset.id));
    rerender();
    try {
      await persistAlbum();
      clearStorageError();
    } catch (error) {
      showStorageError('Таалагдсан тоог хадгалж чадсангүй.');
      console.error(error);
    }
  });

  document.querySelector('#trash-cards').addEventListener('click', async (e) => {
    const imageButton = e.target.closest('.image-btn');
    if (imageButton) {
      openImage(imageButton);
      return;
    }

    const restoreButton = e.target.closest('.restore-btn');
    const deleteButton = e.target.closest('.permanent-delete-btn');
    const button = restoreButton ?? deleteButton;
    if (!button) return;

    const id = Number(button.dataset.id);
    const index = trash.findIndex((photo) => photo.id === id);
    if (index < 0) return;
    const [photo] = trash.splice(index, 1);
    if (restoreButton) album.add(photo);
    else if (!window.confirm(`"${photo.title}" зургийг бүрмөсөн устгах уу?`)) {
      trash.splice(index, 0, photo);
      return;
    }
    rerender();

    try {
      await persistAlbum();
      clearStorageError();
    } catch (error) {
      if (restoreButton) album.remove(id);
      trash.splice(index, 0, photo);
      rerender();
      showStorageError('Хогийн савны өөрчлөлтийг хадгалж чадсангүй.');
      console.error(error);
    }
  });

  const imageDialog = document.querySelector('#image-dialog');
  document.querySelector('#dialog-close').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', (e) => {
    if (e.target === imageDialog) imageDialog.close();
  });

  document.querySelector('#search').addEventListener('input', (e) => {
    state.query = e.target.value;
    renderCards(currentList());
  });

  document.querySelector('#place-filter').addEventListener('change', (e) => {
    state.place = e.target.value;
    renderCards(currentList());
  });

  bindAddForm(document.querySelector('#add-form'), album, async () => {
    await persistAlbum();
    clearStorageError();
    rerender();
  }, () => Math.max(0, ...album.photos.map((p) => p.id), ...trash.map((p) => p.id)) + 1);
  rerender();
}

initialize().catch((error) => {
  showStorageError('Зургийн цомгийг эхлүүлж чадсангүй.');
  console.error(error);
});
