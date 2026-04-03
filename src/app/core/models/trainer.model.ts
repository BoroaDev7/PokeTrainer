export interface Trainer {
  name: string;
  photo: string | null;
  hobby: string;
  birthDate: string;
  documentType: 'dui' | 'minor-id';
  documentNumber: string;
  age: number;
}
