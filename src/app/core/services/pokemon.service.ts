import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, SelectedPokemon, ListEntry } from '../models/pokemon.model';

// Defines the API url
const BASE = 'https://pokeapi.co/api/v2';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private cache = new Map<string | number, unknown>();

  readonly isLoadingList = signal(false);

  constructor(private http: HttpClient) {}

  //Function tu get pokemon and store them in the local storage
  getGen1List(): Observable<ListEntry[]> {
    if (this.cache.has('gen1')) return of(this.cache.get('gen1') as ListEntry[]);

    this.isLoadingList.set(true);
    return this.http
      .get<PokemonListResponse>(`${BASE}/pokemon?limit=151&offset=0`)
      .pipe(
        map(res => res.results.map((p, i) => ({ id: i + 1, name: p.name, sprite: null }))),
        tap(list => {
          this.cache.set('gen1', list);
          this.isLoadingList.set(false);
        }),
        catchError(() => {
          this.isLoadingList.set(false);
          return of([]);
        })
      );
  }

  // get a specific pokemon to use in the search bar
  getPokemonById(id: number): Observable<Pokemon> {
    if (this.cache.has(id)) return of(this.cache.get(id) as Pokemon);
    return this.http.get<Pokemon>(`${BASE}/pokemon/${id}`).pipe(
      tap(p => this.cache.set(id, p))
    );
  }

  mapToSelected(raw: Pokemon): SelectedPokemon {
    return {
      id: raw.id,
      name: raw.name,
      sprite: raw.sprites.other?.home?.front_default ?? '',
      types: raw.types.map(t => t.type.name),
      stats: raw.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    };
  }
}
