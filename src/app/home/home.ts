import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarModalComponent } from '../car-modal/car-modal';
import { CarService } from '../services/car.service';
import { CarDetail } from '../interfaces/interfaces-car';

interface CarRow { title: string; class: string; cars: CarDetail[]; loading: boolean; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CarModalComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  selectedCar: CarDetail | null = null;

  readonly classes = ['S2', 'S1', 'A', 'B', 'C', 'D'];

  carRows: CarRow[] = this.classes.map(cls => ({
    title: `${cls} CLASS`, class: cls, cars: [], loading: true
  }));

  constructor(private carService: CarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carService.getHome().subscribe({
      next: data => {
        this.carRows = this.classes.map(cls => ({
          title: `${cls} CLASS`,
          class: cls,
          cars: data[cls] ?? [],
          loading: false
        }));
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error cargando home:', err);
        this.carRows = this.carRows.map(row => ({ ...row, loading: false }));
        this.cdr.detectChanges();
      }
    });
  }

  getCarTypes(car: CarDetail): string {
    if (!car.tunes?.length) return '';
    return [...new Set(car.tunes.flatMap(t => t.types))].join(' / ').toUpperCase();
  }

  scroll(cls: string, dir: number): void {
    document.getElementById(cls)?.scrollBy({ left: dir * 400, behavior: 'smooth' });
  }

  openModal(car: CarDetail): void { this.selectedCar = car; }
}