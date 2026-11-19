export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
export const average = (...nums) =>
  nums.length === 0 ? 0 : nums.reduce((s, x) => s + x, 0) / nums.length;
export const greet = (name = 'Зочин') => `Сайн уу, ${name}!`;
export const makeCounter = (start = 0) => {
  let count = start;
  return () => count++;
};
// fn-ийг x дээр n удаа дараалан хэрэглэнэ (давталтгүй, рекурсээр)
export const applyN = (fn, n, x) => (n <= 0 ? x : applyN(fn, n - 1, fn(x)));
// compose(f, g)(x) === f(g(x))
export const compose = (f, g) => (x) => f(g(x));