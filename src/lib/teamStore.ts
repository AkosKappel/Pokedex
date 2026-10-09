const STORAGE_KEY = 'team';

export const readTeam = (): number[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored.map(Number).filter(Number.isInteger) : [];
  } catch {
    return [];
  }
};

export const saveTeam = (ids: number[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // The team still lives in the URL.
  }
};

/** Adds a Pokémon to the saved team (used from Pokémon pages); returns false when the team is full. */
export const addToTeam = (id: number, size: number) => {
  const team = readTeam();
  if (team.length >= size) return false;
  saveTeam([...team, id]);
  return true;
};
