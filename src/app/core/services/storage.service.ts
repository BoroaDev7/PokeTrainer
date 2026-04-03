import { Injectable } from '@angular/core';

//Configuration for the local storage to make the app more efficent
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TRAINER_KEY = 'pt_trainer';
  private readonly TEAM_KEY = 'pt_team';

  //set the user data
  setTrainer(data: unknown): void {
    localStorage.setItem(this.TRAINER_KEY, JSON.stringify(data));
  }

  getTrainer(): unknown {
    const raw = localStorage.getItem(this.TRAINER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // Set the 3 selected pokemon, use for setting o editing the user's team
  setTeam(data: unknown): void {
    localStorage.setItem(this.TEAM_KEY, JSON.stringify(data));
  }

  // Get the 3 selected pokemon of the user
  getTeam(): unknown {
    const raw = localStorage.getItem(this.TEAM_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
