// Бүгд шинэ массив буцаана, оролтыг өөрчлөхгүй. for/while байхгүй.
export const titles = (photos) => photos.map((p) => p.title);
export const byPlace = (photos, place) => photos.filter((p) => p.place === place);
export const withTag = (photos, tag) => photos.filter((p) => p.tags.includes(tag));
export const sortByDate = (photos) =>
  [...photos].sort((a, b) => a.date.localeCompare(b.date));
export const topLiked = (photos, n = 3) =>
  [...photos].sort((a, b) => b.likes - a.likes).slice(0, n);
export const searchByTitle = (photos, query) => {
  const q = query.trim().toLowerCase();
  return q === '' ? [...photos] : photos.filter((p) => p.title.toLowerCase().includes(q));
};
export const likePhoto = (photos, id) =>
  photos.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
export const uniqueTags = (photos) => [...new Set(photos.flatMap((p) => p.tags))];