import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
export const routes: Routes = [
    { path: '', redirectTo: 'trainer', pathMatch: 'full' },
    {
        path: 'trainer',
        loadComponent: () =>
          import('./features/trainer/pages/trainer-page.component').then(m => m.TrainerPageComponent),
      },
];
