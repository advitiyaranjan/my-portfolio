/** Makes a stored link absolute, so "files.example.com" opens that site instead of a path on this one. */
export function externalUrl(url?: string) {
  const value = (url || '').trim();
  if (!value || value === '#') return value;
  if (value.startsWith('//')) return `https:${value}`;
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(value)) return value;
  return `https://${value}`;
}
