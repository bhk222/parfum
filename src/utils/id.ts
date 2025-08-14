export function nanoId(size = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const arr = crypto.getRandomValues(new Uint8Array(size));
  for (const n of arr) out += chars[n % chars.length];
  return out;
}