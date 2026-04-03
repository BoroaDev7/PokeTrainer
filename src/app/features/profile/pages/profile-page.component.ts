import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TrainerService } from '../../../core/services/trainer.service';
import { StatsBarComponent } from '../components/stats-bar.component';
import { SelectedPokemon } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterLink, StatsBarComponent, ScrollingModule],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  readonly trainer = computed(() => this.trainerService.trainer());
  readonly team = computed(() => this.trainerService.team());

  constructor(private trainerService: TrainerService) {}

  trackPokemon(_: number, p: SelectedPokemon): number { return p.id; }
}
