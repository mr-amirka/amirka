export const isInsignificant = (m: any) => {
  const type = typeof m;
  if (m === null || m === undefined || (type === 'string' && !m )) return true;
  if (type !== 'object') return false;
  if (typeof(m.length) == 'number') return m.length < 1;
  for (let k in m) return false;
  return true;
};