import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarDetail } from '../interfaces/interfaces-car';

@Component({
  selector: 'app-car-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-modal.html',
  styleUrls: ['./car-modal.css']
})
export class CarModalComponent {
  @Input() car: CarDetail | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void { this.close.emit(); }

  /** Formatea "109871074" → "109 871 074" */
  formatShareCode(code: string): string {
    const clean = code.replace(/\s/g, '');
    return clean.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
}
