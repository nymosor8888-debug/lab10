export class Album {
  #photos = [];

  constructor(photos = []) {
    this.#photos = structuredClone(photos);
  }

  get size() {
    return this.#photos.length;
  }

  // ГҮН хуулбар: гаднаас өөрчилсөн ч дотоод өгөгдөл өөрчлөгдөхгүй
  get photos() {
    return structuredClone(this.#photos);
  }

  find(id) {
    const p = this.#photos.find((x) => x.id === id);
    return p ? structuredClone(p) : undefined;
  }

  add(photo) {
    const maxId = this.#photos.reduce((m, p) => Math.max(m, p.id), 0);
    const added = { likes: 0, tags: [], ...structuredClone(photo), id: photo.id ?? maxId + 1 };
    this.#photos.push(added);
    return structuredClone(added);
  }

  remove(id) {
    const before = this.#photos.length;
    this.#photos = this.#photos.filter((p) => p.id !== id);
    return this.#photos.length < before;
  }

  like(id) {
    const p = this.#photos.find((x) => x.id === id);
    if (!p) return undefined;
    p.likes += 1;
    return p.likes;
  }

  toJSON() {
    return structuredClone(this.#photos);
  }

  static from(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new this(data);
  }
}

export class FeaturedAlbum extends Album {
  #featuredIds = [];

  constructor(photos = []) {
    super(photos);
    this.#refresh();
  }

  #refresh() {
    this.#featuredIds = [...this.photos]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3)
      .map((p) => p.id);
  }

  get featured() {
    return this.photos.filter((p) => this.#featuredIds.includes(p.id));
  }

  add(photo) {
    const r = super.add(photo);
    this.#refresh();
    return r;
  }

  remove(id) {
    const r = super.remove(id);
    this.#refresh();
    return r;
  }

  like(id) {
    const r = super.like(id);
    this.#refresh();
    return r;
  }
}

// Object.groupBy: Chrome 117+, Firefox 119+, Safari 17.4+, Edge 117+ (caniuse-ээр дахин шалга)
export const groupByPlaceNative = (photos) => Object.groupBy(photos, (p) => p.place);