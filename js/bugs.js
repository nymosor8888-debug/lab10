// Гурван функц тус бүр НЭГ алдаатай (буруу хувилбар). Засвар нь доорх fixed* функцүүд.

// 1) average: reduce-д эхлэл утга (0) байхгүй тул хоосон массивт TypeError шиднэ
export const buggyAverage = (nums) => nums.reduce((s, x) => s + x) / nums.length;
export const fixedAverage = (nums) =>
  nums.length === 0 ? 0 : nums.reduce((s, x) => s + x, 0) / nums.length;

// 2) topLiked: sort нь оролтын массивыг өөрчилдөг (мутаци)
export const buggyTopLiked = (photos, n) => photos.sort((a, b) => b.likes - a.likes).slice(0, n);
export const fixedTopLiked = (photos, n) =>
  [...photos].sort((a, b) => b.likes - a.likes).slice(0, n);

// 3) addTag: tags массивыг хуваалцсан тул push нь анхны объектыг өөрчилдөг (гүехэн хуулбар)
export const buggyAddTag = (photo, tag) => {
  const copy = { ...photo };
  copy.tags.push(tag);
  return copy;
};
export const fixedAddTag = (photo, tag) => ({ ...photo, tags: [...photo.tags, tag] });
