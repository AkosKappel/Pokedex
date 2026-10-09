import type { ChainLink, EvolutionDetail } from './api';
import { idFromUrl, titleCase } from './format';

export interface Evolution {
  id: number;
  /** How this Pokémon evolves from the previous stage, empty for the first stage. */
  condition: string;
}

/** Each stage of the chain in order; branching evolutions (Eevee) share a stage. */
export const evolutionStages = (root: ChainLink): Evolution[][] => {
  const stages: Evolution[][] = [];
  const visit = (link: ChainLink, depth: number) => {
    (stages[depth] ??= []).push({
      id: idFromUrl(link.species.url),
      condition: describeEvolution(link.evolution_details),
    });
    link.evolves_to.forEach(next => visit(next, depth + 1));
  };
  visit(root, 0);
  return stages;
};

/**
 * PokéAPI lists one detail per game method (Leafeon has six). Prefer an item, which works in
 * every recent game, otherwise describe the first method.
 */
export const describeEvolution = (details: EvolutionDetail[]): string => {
  const detail = details.find(d => d.item) ?? details[0];
  if (!detail) return '';

  const conditions = [
    detail.held_item && `holding ${titleCase(detail.held_item.name)}`,
    detail.known_move && `knowing ${titleCase(detail.known_move.name)}`,
    detail.known_move_type && `knowing a ${titleCase(detail.known_move_type.name)} move`,
    detail.min_happiness && 'with high friendship',
    detail.min_affection && 'with high affection',
    detail.time_of_day === 'day' && 'during the day',
    detail.time_of_day === 'night' && 'at night',
    detail.location && `at ${titleCase(detail.location.name)}`,
    detail.trade_species && `for ${titleCase(detail.trade_species.name)}`,
  ].filter(Boolean);

  const trigger = detail.trigger.name;
  const action =
    trigger === 'level-up'
      ? detail.min_level
        ? `Level ${detail.min_level}`
        : 'Level up'
      : trigger === 'use-item' && detail.item
        ? `Use ${titleCase(detail.item.name)}`
        : titleCase(trigger);

  return [action, ...conditions].join(' ');
};
