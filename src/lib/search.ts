/**
 * Lowercase, without accents, punctuation or spaces, with full-width characters folded, so
 * "Mr. Mime" matches "mr mime", "Flabébé" matches "flabebe" and "１０まんボルト" matches "10まんボルト".
 */
export const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}♀♂]/gu, '');

/** True when any of the names contains the query; an empty query matches everything. */
export const matchesQuery = (query: string, ...names: (string | undefined)[]) => {
  const wanted = normalize(query);
  return !wanted || names.some(name => name !== undefined && normalize(name).includes(wanted));
};

export const isExactMatch = (query: string, ...names: (string | undefined)[]) => {
  const wanted = normalize(query);
  return Boolean(wanted) && names.some(name => name !== undefined && normalize(name) === wanted);
};
