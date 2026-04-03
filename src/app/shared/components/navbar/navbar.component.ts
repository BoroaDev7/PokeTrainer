import { Component, computed, signal, HostListener, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../core/services/trainer.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly trainer = computed(() => this.trainerService.trainer());
  dropdownOpen = signal(false);

  constructor(private trainerService: TrainerService, private el: ElementRef) {}

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }
  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownOpen.set(false);
    }
  }
}
