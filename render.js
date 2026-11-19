const COLORS = ['#3d6a8e', '#8e5a3d', '#4f8a5b', '#7a4f8a', '#b0683f'];

export const makeCard = (p) => `
  <article class="card">
    <div class="thumb" style="background:${COLORS[p.id % COLORS.length]}">📷</div>
    <div class="body">
      <h3>${p.title}</h3>
      <p class="meta">${p.place} · ${p.date}</p>
      <div>${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      <button class="like-btn" data-id="${p.id}">❤ ${p.likes}</button>
    </div>
  </article>`;

export const renderCards = (list) => {
  document.querySelector('#cards').innerHTML =
    list.length ? list.map(makeCard).join('') : '<p class="empty">Зураг олдсонгүй</p>';
  document.querySelector('#count').textContent = `${list.length} зураг`;
};
