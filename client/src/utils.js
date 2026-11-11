export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const TYPE_LABEL = { 'private-room': 'Private room', 'shared-room': 'Shared room', 'entire-place': 'Entire place' };
export const AMENITIES = ['wifi', 'ac', 'parking', 'washing machine', 'kitchen', 'geyser', 'power backup',
  'gym', 'housekeeping', 'attached bathroom', 'balcony', 'lift', 'security', 'tv'];
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible');
export const inputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const timeAgo = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDate(d);
};
export const LIFESTYLE_LABEL = {
  smoking: { no: 'Non-smoker', outside: 'Smokes outside', yes: 'Smoker' },
  pets: { no: 'No pets please', ok: 'Fine with pets', have: 'Has a pet' },
  sleep: { early: 'Early riser', flexible: 'Flexible hours', night: 'Night owl' },
  guests: { rarely: 'Rarely has guests', sometimes: 'Occasional guests', often: 'Often has guests' },
  diet: { any: 'Eats anything', vegetarian: 'Vegetarian', vegan: 'Vegan' }
};
export const cleanLabel = ['', 'Very relaxed', 'Relaxed', 'Balanced', 'Tidy', 'Spotless'];
