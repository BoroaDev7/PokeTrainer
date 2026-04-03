import { Injectable, signal, computed } from '@angular/core';
import { Trainer } from '../models/trainer.model';
import { SelectedPokemon } from '../models/pokemon.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private _trainer = signal<Trainer | null>(null);
  private _team = signal<SelectedPokemon[]>([]);

  trainer = this._trainer.asReadonly();
  team = this._team.asReadonly();
  hasTrainer = computed(() => !!this._trainer());
  hasTeam = computed(() => this._team().length === 3);

  constructor(private storage: StorageService) {
    const savedTrainer = this.storage.getTrainer();
    if (savedTrainer) this._trainer.set(savedTrainer as Trainer);

    const savedTeam = this.storage.getTeam();
    if (savedTeam) this._team.set(savedTeam as SelectedPokemon[]);
  }

  setTrainer(trainer: Trainer): void {
    this._trainer.set(trainer);
    this.storage.setTrainer(trainer);
  }

  setTeam(team: SelectedPokemon[]): void {
    this._team.set(team);
    this.storage.setTeam(team);
  }
}
