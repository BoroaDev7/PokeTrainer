import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TrainerService } from '../services/trainer.service';

export const trainerGuard: CanActivateFn = () => {
  const trainer = inject(TrainerService);
  const router = inject(Router);
  if (trainer.hasTrainer()) return true;
  return router.createUrlTree(['/trainer']);
};

export const teamGuard: CanActivateFn = () => {
  const trainer = inject(TrainerService);
  const router = inject(Router);
  if (!trainer.hasTrainer()) return router.createUrlTree(['/trainer']);
  if (!trainer.hasTeam()) return router.createUrlTree(['/pokemon']);
  return true;
};
