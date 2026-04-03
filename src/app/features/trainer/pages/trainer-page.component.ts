import { Component, signal, computed, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TrainerService } from '../../../core/services/trainer.service';
import { Trainer } from '../../../core/models/trainer.model';

function duiValidator(c: AbstractControl) {
  return /^\d{8}-\d$/.test(c.value) ? null : { invalidDui: true };
}

function calcAge(dateStr: string): number {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

@Component({
  selector: 'app-trainer-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './trainer-page.component.html',
})
export class TrainerPageComponent implements OnInit {
  form!: FormGroup;
  photoPreview = signal<string | null>(null);
  isAdult = signal(false);
  submitted = signal(false);

  readonly isEditing = computed(() => !!this.trainerService.trainer());

  constructor(
    private fb: FormBuilder,
    private trainerService: TrainerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      hobby: [''],
      birthDate: ['', Validators.required],
      documentNumber: [''],
      photo: [null, Validators.required],
    });

    const existing = this.trainerService.trainer();
    if (existing) {
      this.form.patchValue(existing);
      this.photoPreview.set(existing.photo);
      this.isAdult.set(calcAge(existing.birthDate) >= 18);
      this.updateDocValidation();
    }

    this.form.get('birthDate')!.valueChanges.subscribe(val => {
      if (val) {
        this.isAdult.set(calcAge(val) >= 18);
        this.updateDocValidation();
      }
    });
  }

  updateDocValidation(): void {
    const ctrl = this.form.get('documentNumber')!;
    if (this.isAdult()) {
      ctrl.setValidators([Validators.required, duiValidator]);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity();
  }

  onPhotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.photoPreview.set(result);
      this.form.get('photo')!.setValue(result);
    };
    reader.readAsDataURL(file);
  }

  get f() { return this.form.controls; }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const val = this.form.value;
    const trainer: Trainer = {
      name: val.name,
      photo: val.photo,
      hobby: val.hobby,
      birthDate: val.birthDate,
      documentType: this.isAdult() ? 'dui' : 'minor-id',
      documentNumber: val.documentNumber ?? '',
      age: calcAge(val.birthDate),
    };

    this.trainerService.setTrainer(trainer);
    this.router.navigate(['/pokemon']);
  }
}
