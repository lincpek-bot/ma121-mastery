// Number rounding + small TeX builders.
export function round(x, dp = 4) {
  if (!isFinite(x)) return x;
  const f = Math.pow(10, dp);
  const r = Math.round(x * f) / f;
  return Object.is(r, -0) ? 0 : r;
}
export function fmt(x, dp = 4) {
  const r = round(x, dp);
  if (Number.isInteger(r)) return String(r);
  return String(r);
}
// Build a fraction TeX string from numerator/denom (as TeX strings).
export function frac(n, d) { return `\\dfrac{${n}}{${d}}`; }
export function paren(s) { return `\\left(${s}\\right)`; }
