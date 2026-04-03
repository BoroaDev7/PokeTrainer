import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-poke-card',
  templateUrl:'./poke-card.component.html',
})
export class PokeCardComponent {
  id = input.required<number>();
  name = input.required<string>();
  sprite = input<string | null>(null);
  selected = input(false);
  disabled = input(false);

  toggle = output<number>();

  onSelect(): void {
    if (!this.disabled()) this.toggle.emit(this.id());
  }
}
