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

export function bindAddForm(formEl, album, onAdded, nextId) {
  const fileInput = formEl.querySelector('input[name="image"]');
  const preview = formEl.querySelector('#image-preview');

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    formEl.querySelector('[data-error="image"]').textContent = '';
    preview.hidden = true;
    preview.removeAttribute('src');

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      formEl.querySelector('[data-error="image"]').textContent = 'Зөвхөн зураг сонгоно уу';
      fileInput.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      formEl.querySelector('[data-error="image"]').textContent = 'Зураг 5MB-аас бага байх ёстой';
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formEl));
    const errors = validate(data);
    formEl.querySelectorAll('[data-error]').forEach((el) => (el.textContent = ''));
    Object.entries(errors).forEach(([k, msg]) => {
      const el = formEl.querySelector(`[data-error="${k}"]`);
      if (el) el.textContent = msg;
    });
    if (Object.keys(errors).length) return;

    const file = fileInput?.files?.[0];
    let image = '';
    if (file) {
      image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Зураг уншиж чадсангүй'));
        reader.readAsDataURL(file);
      });
    }

    const added = album.add({
      title: data.title.trim(),
      place: data.place.trim(),
      date: data.date,
      image,
      id: nextId?.(),
    });
    try {
      await onAdded?.();
    } catch (error) {
      album.remove(added.id);
      formEl.querySelector('[data-error="storage"]').textContent = 'Зургийг хадгалж чадсангүй. Дахин оролдоно уу.';
      console.error(error);
      return;
    }

    formEl.reset();
    preview.hidden = true;
    preview.removeAttribute('src');
  });
}
