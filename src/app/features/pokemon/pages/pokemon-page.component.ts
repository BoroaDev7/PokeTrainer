import { Component, signal, computed, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { forkJoin } from 'rxjs';
import { register as registerSwiper } from 'swiper/element/bundle';
import { PokemonService } from '../../../core/services/pokemon.service';
import { TrainerService } from '../../../core/services/trainer.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ListEntry, SelectedPokemon } from '../../../core/models/pokemon.model';

registerSwiper();

@Component({
  selector: 'app-pokemon-page',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, RouterLink, LoadingComponent, ScrollingModule],
  templateUrl: './pokemon-page.component.html',
})
export class PokemonPageComponent implements OnInit {
  allPokemon = signal<ListEntry[]>([]);
  selectedIds = signal<Set<number>>(new Set());
  searchQuery = signal('');
  isLoading = signal(true);
  isConfirming = signal(false);

  readonly trainer = computed(() => this.trainerService.trainer());

  readonly filteredList = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const list = this.allPokemon();
    if (!q) return list;
    if (!isNaN(Number(q))) return list.filter(p => p.id === Number(q));
    return list.filter(p => p.name.toLowerCase().includes(q));
  });

  // Group pokemon into rows of 3 for virtual scroll
  readonly rowList = computed(() => {
    const list = this.filteredList();
    const rows: ListEntry[][] = [];
    for (let i = 0; i < list.length; i += 3) {
      rows.push(list.slice(i, i + 3));
    }
    return rows;
  });

  readonly canConfirm = computed(() => this.selectedIds().size === 3);

  constructor(
    private pokemonService: PokemonService,
    private trainerService: TrainerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const existing = this.trainerService.team();
    if (existing.length) {
      this.selectedIds.set(new Set(existing.map((p: SelectedPokemon) => p.id)));
    }

    this.pokemonService.getGen1List().subscribe(list => {
      this.allPokemon.set(list);
      this.isLoading.set(false);
      this.loadSprites(list);
    });
  }

  private loadSprites(list: ListEntry[]): void {
    const CHUNK = 20;
    let index = 0;
    const loadNext = () => {
      const chunk = list.slice(index, index + CHUNK);
      if (!chunk.length) return;
      chunk.forEach(entry => {
        this.pokemonService.getPokemonById(entry.id).subscribe({
          next: raw => {
            this.allPokemon.update(current =>
              current.map(p =>
                p.id === entry.id
                  ? { ...p, sprite: raw.sprites.other?.home?.front_default ?? null }
                  : p
              )
            );
          },
          error: () => {},
        });
      });
      index += CHUNK;
      setTimeout(loadNext, 700);
    };
    loadNext();
  }

  toggleSelect(id: number): void {
    this.selectedIds.update(current => {
      const next = new Set(current);
      if (next.has(id)) { next.delete(id); }
      else if (next.size < 3) { next.add(id); }
      return next;
    });
  }

  isDisabled(id: number): boolean {
    return this.selectedIds().size >= 3 && !this.selectedIds().has(id);
  }

  confirmTeam(): void {
    if (!this.canConfirm()) return;
    this.isConfirming.set(true);
    forkJoin(
      Array.from(this.selectedIds()).map(id => this.pokemonService.getPokemonById(id))
    ).subscribe({
      next: rawList => {
        this.trainerService.setTeam(rawList.map(r => this.pokemonService.mapToSelected(r)));
        this.router.navigate(['/profile']);
      },
      error: () => this.isConfirming.set(false),
    });
  }

  onSearchChange(value: string): void { this.searchQuery.set(value); }

  padId(id: number): string { return id.toString().padStart(3, '0'); }
  capitalize(name: string): string { return name.charAt(0).toUpperCase() + name.slice(1); }
  trackRow(_: number, row: ListEntry[]): number { return row[0]?.id ?? _; }
}
