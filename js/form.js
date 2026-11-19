// Лаб 9-ийн validator байхгүй тул ижил хэлбэрийн энгийн validator-уудыг энд бичсэн.
// Лаб 9-ийнхээ validator-аар солихдоо зөвхөн нэр/import-ыг сольж болно.
export const required = (v) => (String(v ?? '').trim() ? null : 'Заавал бөглөнө');
export const minLen = (n) => (v) =>
  String(v ?? '').trim().length >= n ? null : `Хамгийн багадаа ${n} тэмдэгт`;
export const validDate = (v) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) ? null : 'Огноо буруу (YYYY-MM-DD)';

export function validate(data) {
  const rules = {
    title: [required, minLen(2)],
    place: [required],
    date: [required, validDate],
  };
  return Object.fromEntries(
    Object.entries(rules)
      .map(([k, fns]) => [k, fns.map((f) => f(data[k])).find(Boolean)])
      .filter(([, err]) => err)
  );
}

export function bindAddForm(formEl, album, onAdded) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formEl));
    const errors = validate(data);
    formEl.querySelectorAll('[data-error]').forEach((el) => (el.textContent = ''));
    Object.entries(errors).forEach(([k, msg]) => {
      const el = formEl.querySelector(`[data-error="${k}"]`);
      if (el) el.textContent = msg;
    });
    if (Object.keys(errors).length) return;
    album.add({ title: data.title.trim(), place: data.place.trim(), date: data.date });
    formEl.reset();
    onAdded?.();
  });
}
