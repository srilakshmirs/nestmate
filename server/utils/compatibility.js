// Returns a 0-100 roommate compatibility score, or null if there's not enough data.
const idx = (list, v) => list.indexOf(v);

export function compatibility(a, b) {
  let score = 0;
  let max = 0;
  const add = (weight, value) => { max += weight; score += weight * value; };

  // Budget overlap (20)
  if (a.budget?.max && b.budget?.max) {
    const aMin = a.budget.min || 0, bMin = b.budget.min || 0;
    const lo = Math.max(aMin, bMin);
    const hi = Math.min(a.budget.max, b.budget.max);
    const span = Math.max(a.budget.max - aMin, b.budget.max - bMin, 1);
    add(20, hi >= lo ? 1 : Math.max(0, 1 - (lo - hi) / span));
  }

  // City (15)
  if (a.city && b.city) add(15, a.city.toLowerCase() === b.city.toLowerCase() ? 1 : 0);

  // Move-in timing (10)
  if (a.moveInDate && b.moveInDate) {
    const days = Math.abs(new Date(a.moveInDate) - new Date(b.moveInDate)) / 864e5;
    add(10, 1 - Math.min(days, 60) / 60);
  }

  const la = a.lifestyle || {}, lb = b.lifestyle || {};

  // Smoking (15)
  if (la.smoking && lb.smoking) {
    const order = ['no', 'outside', 'yes'];
    add(15, 1 - Math.abs(idx(order, la.smoking) - idx(order, lb.smoking)) / 2);
  }
  // Pets (10)
  if (la.pets && lb.pets) {
    const clash = (la.pets === 'no' && lb.pets === 'have') || (lb.pets === 'no' && la.pets === 'have');
    add(10, clash ? 0 : 1);
  }
  // Cleanliness (10)
  if (la.cleanliness && lb.cleanliness) add(10, 1 - Math.abs(la.cleanliness - lb.cleanliness) / 4);
  // Sleep schedule (10)
  if (la.sleep && lb.sleep) {
    if (la.sleep === lb.sleep) add(10, 1);
    else if (la.sleep === 'flexible' || lb.sleep === 'flexible') add(10, 0.7);
    else add(10, 0);
  }
  // Guests (5)
  if (la.guests && lb.guests) {
    const order = ['rarely', 'sometimes', 'often'];
    add(5, 1 - Math.abs(idx(order, la.guests) - idx(order, lb.guests)) / 2);
  }
  // Diet (5)
  if (la.diet && lb.diet) add(5, la.diet === lb.diet || la.diet === 'any' || lb.diet === 'any' ? 1 : 0.4);

  return max === 0 ? null : Math.round((score / max) * 100);
}
