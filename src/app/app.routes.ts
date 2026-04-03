import { Routes } from '@angular/router';
import { trainerGuard, teamGuard } from './core/guards/trainer.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'trainer', pathMatch: 'full' },
  {
    path: 'trainer',
    loadComponent: () =>
      import('./features/trainer/pages/trainer-page.component').then((m) => m.TrainerPageComponent),
  },
  {
    path: 'pokemon',
    canActivate: [trainerGuard],
    loadComponent: () =>
      import('./features/pokemon/pages/pokemon-page.component').then((m) => m.PokemonPageComponent),
  },
  {
    path: 'profile',
    canActivate: [teamGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile-page.component').then((m) => m.ProfilePageComponent),
  },
  { path: '**', redirectTo: 'trainer' },
];
