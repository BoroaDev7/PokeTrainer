import { Pipe, PipeTransform } from '@angular/core';
import { ListEntry } from '../../core/models/pokemon.model';

@Pipe({ name: 'pokemonSearch', standalone: true })
export class PokemonSearchPipe implements PipeTransform {
  transform(list: ListEntry[], query: string): ListEntry[] {
    if (!query?.trim()) return list;
    const q = query.trim().toLowerCase();
    if (!isNaN(Number(q))) return list.filter(p => p.id === Number(q));
    return list.filter(p => p.name.toLowerCase().includes(q));
  }
}
