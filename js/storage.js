const DATABASE_NAME = 'photo-album';
const DATABASE_VERSION = 1;
const STORE_NAME = 'albums';
const PHOTOS_KEY = 'photos';
const TRASH_KEY = 'trash';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadAlbum(fallbackPhotos) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const photosRequest = store.get(PHOTOS_KEY);
    const trashRequest = store.get(TRASH_KEY);
    transaction.oncomplete = () => {
      database.close();
      resolve({
        photos: photosRequest.result ?? fallbackPhotos,
        trash: trashRequest.result ?? [],
      });
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error('Зургийн мэдээллийг уншиж чадсангүй'));
    };
  });
}

export async function saveAlbum({ photos, trash }) {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(photos, PHOTOS_KEY);
    store.put(trash, TRASH_KEY);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error('Зургийн мэдээллийг хадгалж чадсангүй'));
    };
  });
}
