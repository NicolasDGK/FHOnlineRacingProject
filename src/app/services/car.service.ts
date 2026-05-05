// src/app/services/car.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDetail } from '../interfaces/interfaces-car';

@Injectable({ providedIn: 'root' })
export class CarService {
  private apiUrl = 'https://industrious-appreciation-production-7c96.up.railway.app/api';

  constructor(private http: HttpClient) {}

  /**
   * Devuelve todos los autos de una clase con sus tunes.
   * El backend ya arma el CarDetail completo (incluyendo isMeta desde cars.is_meta).
   */
  getCarsByClass(className: string): Observable<CarDetail[]> {
    return this.http.get<CarDetail[]>(`${this.apiUrl}/cars?class=${className}`);
  }

  /**
   * Devuelve 8 autos aleatorios de una clase para la home row,
   * garantizando al menos 1 META si existe en esa clase.
   */
  getHomeRowByClass(className: string): Observable<CarDetail[]> {
    return this.http.get<CarDetail[]>(`${this.apiUrl}/cars/home-row?class=${className}`);
  }
}
