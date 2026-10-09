import { describe, expect, it } from 'vitest';
import { cleanFlavorText, formatHeight, formatWeight, idFromUrl, titleCase } from './format';

describe('format', () => {
  it('converts PokéAPI units', () => {
    expect(formatHeight(4)).toBe('0.4 m');
    expect(formatWeight(60)).toBe('6.0 kg');
  });

  it('removes game screen line breaks', () => {
    expect(cleanFlavorText('When several of\nthese POKéMON\fgather, their­electricity')).toBe(
      'When several of these POKéMON gather, their electricity',
    );
  });

  it('title-cases slugs and reads ids from URLs', () => {
    expect(titleCase('lightning-rod')).toBe('Lightning Rod');
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon-species/133/')).toBe(133);
  });
});
