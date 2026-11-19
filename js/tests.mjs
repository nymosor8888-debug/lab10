import { Album } from './album.js';
import { topLiked, searchByTitle, likePhoto } from './photoTools.js';
import { addTag } from './objectTools.js';
import { validate } from './form.js';
import { buggyAverage, fixedAverage, buggyTopLiked, fixedTopLiked, buggyAddTag, fixedAddTag } from './bugs.js';

let fail = 0;
const test = (name, fn) => {
  try { fn(); console.log('✓', name); } catch (e) { fail++; console.log('✗', name, '-', e.message); }
};
const eq = (a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${JSON.stringify(a)} != ${JSON.stringify(b)}`); };
const P = () => [
  { id: 1, title: 'Говь', place: 'Гоби', date: '2024-05-01', likes: 2, tags: [] },
  { id: 2, title: 'Нуур', place: 'Хөвсгөл', date: '2024-01-01', likes: 5, tags: ['a'] },
];

// Багшийн тест байхгүй тул өөрийн 5 шинэ тест
test('хоосон массив: topLiked', () => eq(topLiked([], 3), []));
test('хоосон Album: size ба add id=1', () => { const a = new Album(); eq(a.size, 0); eq(a.add({ title: 'x' }).id, 1); });
test('давхардсан like: 2 удаа like -> +2', () => { const a = new Album(P()); a.like(1); a.like(1); eq(a.find(1).likes, 4); });
test('зөвхөн зай бүхий хайлт бүгдийг буцаана', () => eq(searchByTitle(P(), '   ').length, 2));
test('photos getter гүн хуулбар', () => { const a = new Album(P()); a.photos[0].tags.push('z'); eq(a.find(1).tags, []); });

// Нэмэлт шалгалт
test('likePhoto оролтыг өөрчлөхгүй', () => { const p = P(); likePhoto(p, 1); eq(p[0].likes, 2); });
test('validate: буруу form', () => eq(Object.keys(validate({ title: '', place: '', date: 'abc' })), ['title', 'place', 'date']));
test('addTag давхардуулахгүй', () => eq(addTag(P()[1], 'a').tags, ['a']));

// Bug-ууд
test('bug1: buggyAverage([]) алдаа шиднэ, fixed 0', () => { let threw = false; try { buggyAverage([]); } catch { threw = true; } if (!threw) throw new Error('bug alga'); eq(fixedAverage([]), 0); });
test('bug2: buggyTopLiked мутаци хийдэг', () => { const p = P(); buggyTopLiked(p, 1); eq(p[0].id, 2); const q = P(); fixedTopLiked(q, 1); eq(q[0].id, 1); });
test('bug3: buggyAddTag анхныг өөрчилдөг', () => { const p = P()[0]; buggyAddTag(p, 'x'); eq(p.tags, ['x']); const q = P()[0]; fixedAddTag(q, 'x'); eq(q.tags, []); });
process.exit(fail ? 1 : 0);
