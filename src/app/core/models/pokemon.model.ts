export interface PokemonListResponse {
  count: number;
  next: string | null;
  results: { name: string; url: string }[];
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface PokemonType {
  type: { name: string };
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: { home: { front_default: string } };
  };
  types: PokemonType[];
  stats: PokemonStat[];
}

export interface SelectedPokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: { name: string; value: number }[];
}

export interface ListEntry {
  id: number;
  name: string;
  sprite: string | null;
}
