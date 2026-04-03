import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDuiMask]',
  standalone: true,
})
export class DuiMaskDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value.replace(/\D/g, '').slice(0, 9);
    const formatted = raw.length > 8 ? `${raw.slice(0, 8)}-${raw.slice(8)}` : raw;
    this.control.control?.setValue(formatted, { emitEvent: false });
  }
}
