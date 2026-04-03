import { Component, input } from '@angular/core';

const STAT_MAX: Record<string, number> = {
  hp: 255, attack: 190, defense: 230,
  'special-attack': 194, 'special-defense': 230, speed: 180,
};

const STAT_LABEL: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'Ataque Especial',
  'special-defense': 'Defensa Especial',
  speed: 'Velocidad',
};

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  templateUrl:'./stats-bar.component.html',
})
export class StatsBarComponent {
  stats = input<{ name: string; value: number }[]>([]);

  getLabel(name: string): string { return STAT_LABEL[name] ?? name; }

  getPercent(name: string, value: number): number {
    return Math.min((value / (STAT_MAX[name] ?? 255)) * 100, 100);
  }
}
