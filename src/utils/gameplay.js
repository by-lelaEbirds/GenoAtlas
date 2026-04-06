export const MAX_IMPACT_RINGS = 8;
export const MAX_TRAVEL_ARCS = 24;

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDailyCountries(pool, date = new Date()) {
  let seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

  const random = () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const filtered = pool.filter((country) => country.pop > 10000000);
  const shuffled = [...filtered];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, 5);
}

export function appendWithLimit(items, nextItem, limit) {
  if (limit <= 1) return [nextItem];

  return [...items.slice(-(limit - 1)), nextItem];
}
