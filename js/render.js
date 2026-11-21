const COLORS = ['#3d6a8e', '#8e5a3d', '#4f8a5b', '#7a4f8a', '#b0683f'];

const makeCard = (p, actions) => `
  <article class="card">
    <div class="thumb" style="background:${COLORS[p.id % COLORS.length]}">
      ${p.image
        ? `<button class="image-btn" type="button" data-image="${p.image}" data-title="${p.title}" aria-label="${p.title} зургийг томруулж харах">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
          </button>`
        : '<span aria-hidden="true">📷</span>'}
    </div>
    <div class="body">
      <h3>${p.title}</h3>
      <p class="meta">${p.place} · ${p.date}</p>
      <div>${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      ${actions(p)}
    </div>
  </article>`;

export const renderCards = (list) => {
  document.querySelector('#cards').innerHTML =
    list.length
      ? list.map((p) => makeCard(p, (photo) => `
          <button class="like-btn" data-id="${photo.id}">❤ ${photo.likes}</button>
          <button class="delete-btn" type="button" data-id="${photo.id}">Устгах</button>`)).join('')
      : '<p class="empty">Зураг олдсонгүй</p>';
  document.querySelector('#count').textContent = `${list.length} зураг`;
};

export const renderTrashCards = (list) => {
  document.querySelector('#trash-cards').innerHTML =
    list.length
      ? list.map((p) => makeCard(p, (photo) => `
          <button class="restore-btn" type="button" data-id="${photo.id}">Сэргээх</button>
          <button class="permanent-delete-btn" type="button" data-id="${photo.id}">Бүрмөсөн устгах</button>`)).join('')
      : '<p class="empty">Хогийн сав хоосон байна</p>';
  document.querySelector('#trash-count').textContent = `${list.length}`;
};
