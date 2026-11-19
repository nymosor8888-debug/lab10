// Оролтын объект/массивыг өөрчлөхгүй.
export const pick = (obj, ...keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));
export const omit = (obj, ...keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
export const withLike = (photo) => ({ ...photo, likes: photo.likes + 1 });
export const addTag = (photo, tag) => ({
  ...photo,
  tags: photo.tags.includes(tag) ? photo.tags : [...photo.tags, tag],
});
export const removeTag = (photo, tag) => ({
  ...photo,
  tags: photo.tags.filter((t) => t !== tag),
});
export const updatePhoto = (photo, changes) => ({ ...photo, ...changes });
export const summary = ({ title, place, date, ...rest }) =>
  `${title} (${place}, ${date}) — ${rest.likes ?? 0} like`;
export const groupByPlace = (photos) =>
  photos.reduce(
    (acc, p) => ({ ...acc, [p.place]: [...(acc[p.place] ?? []), p] }),
    {}
  );