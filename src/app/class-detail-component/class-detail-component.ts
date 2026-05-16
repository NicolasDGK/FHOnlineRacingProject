import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarDetail } from '../interfaces/interfaces-car';
import { CarService } from '../services/car.service';
import { CarModalComponent } from '../car-modal/car-modal';

@Component({
  selector: 'app-class-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CarModalComponent],
  templateUrl: './class-detail-component.html',
  styleUrls: ['./class-detail-component.css']
})
export class ClassDetailComponent implements OnInit {
  className = '';
  selectedCar: CarDetail | null = null;
  loading = true;
  error: string | null = null;

  allCars: CarDetail[] = [];
  filteredCars: CarDetail[] = [];

  readonly filters = ['All', 'Allround', 'Speed', 'Dirt', 'CC', 'META'];
  activeFilter = 'All';

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.className = params.get('className')?.toUpperCase() ?? '';
      if (this.className) this.loadCars();
    });
  }

  private loadCars(): void {
    this.loading = true;
    this.error = null;
    this.allCars = [];
    this.filteredCars = [];
    this.selectedCar = null;

    this.carService.getCarsByClass(this.className).subscribe({
      next: cars => {
        this.allCars = cars;
        this.setFilter('All');
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error:', err);
        this.error = 'No se pudieron cargar los autos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCarTypes(car: CarDetail): string {
    return [...new Set(car.tunes.flatMap(t => t.types))].join(' / ').toUpperCase();
  }

  setFilter(f: string): void {
    this.activeFilter = f;
    if (f === 'All') {
      this.filteredCars = [...this.allCars];
    } else if (f === 'META') {
      this.filteredCars = this.allCars.filter(c => c.isMeta);
    } else {
      const fl = f.toLowerCase();
      this.filteredCars = this.allCars.filter(c =>
        c.tunes.some(t => t.types.some(type => type.includes(fl)))
      );
    }
    this.filteredCars.sort((a, b) => a.name.localeCompare(b.name));
  }

  openModal(car: CarDetail): void  { this.selectedCar = car; }
  closeModal(): void { this.selectedCar = null; }
}
