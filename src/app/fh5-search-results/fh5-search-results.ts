// src/app/fh5-search-results/fh5-search-results.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { CarDetail } from '../interfaces/interfaces-car';
import { CarModalComponent } from '../car-modal/car-modal';

@Component({
  selector: 'app-fh5-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, CarModalComponent],
  templateUrl: './fh5-search-results.html',
  styleUrls: ['./fh5-search-results.css']
})
export class Fh5SearchResultsComponent implements OnInit {
  query = '';
  results: CarDetail[] = [];
  loading = false;
  selectedCar: CarDetail | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Reaccionar cada vez que cambian los queryParams
    // (permite buscar de nuevo desde este mismo componente)
    this.route.queryParamMap.subscribe(params => {
      this.query   = params.get('q') ?? '';
      const openCarId    = Number(params.get('openCar'))   || null;
      const openCarClass = params.get('openClass') ?? '';

      if (this.query) {
        this.search(openCarId, openCarClass);
      }
    });
  }

  private search(openCarId: number | null, openCarClass: string): void {
    this.loading = true;
    this.results = [];
    this.selectedCar = null;
    this.cdr.detectChanges();

    // Reutilizamos el endpoint /api/search pero pedimos los datos completos
    this.http
      .get<CarDetail[]>(
        `https://industrious-appreciation-production-7c96.up.railway.app/api/search/full?q=${encodeURIComponent(this.query.trim())}`
      )
      .pipe(catchError(() => of([])))
      .subscribe(cars => {
        this.results = cars;
        this.loading = false;
        this.cdr.detectChanges();

        // Si llegamos desde el dropdown con un auto específico, abrir su modal
        if (openCarId && openCarClass) {
          const car = cars.find(
            c => c.id === openCarId && c.class === openCarClass.toUpperCase()
          );
          if (car) {
            this.selectedCar = car;
            this.cdr.detectChanges();
          }
        }
      });
  }

  getCarTypes(car: CarDetail): string {
    if (!car.tunes?.length) return '';
    return [...new Set(car.tunes.flatMap(t => t.types))].join(' / ').toUpperCase();
  }

  openModal(car: CarDetail): void  { this.selectedCar = car; }
  closeModal(): void { this.selectedCar = null; }
}
