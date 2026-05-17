import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CarDetail } from '../interfaces/interfaces-car';
import { SearchResult } from '../app';
import { environment } from '../../environments/environment';

export interface HomeData {
  [cls:string]: CarDetail[];
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private apiUrl = environment.apiUrl;

  // Caché en memoria 
  private cacheCarsByClass = new Map<string, CarDetail[]>();
  private cacheHomeRow     = new Map<string, CarDetail[]>();
  private cacheSearch      = new Map<string, SearchResult[]>();
  private cacheSearchFull  = new Map<string, CarDetail[]>();
  private cacheHome: HomeData | null = null;

  constructor(private http: HttpClient) {}

  //Devuelve todos los autos de una clase con sus tunes

  getCarsByClass(className: string): Observable<CarDetail[]> {
    if (this.cacheCarsByClass.has(className)) {
      return of(this.cacheCarsByClass.get(className)!);
    }
    return this.http.get<CarDetail[]>(`${this.apiUrl}/cars?class=${className}`).pipe(
      tap(data => this.cacheCarsByClass.set(className, data))
    );
  }

  //Devuelve 8 autos aleatorios de una clase para la home row, garantizando al menos 1 META si existe en esa clase.
  getHomeRowByClass(className: string): Observable<CarDetail[]> {
    if (this.cacheHomeRow.has(className)) {
      return of(this.cacheHomeRow.get(className)!);
    }
    return this.http.get<CarDetail[]>(`${this.apiUrl}/cars/home-row?class=${className}`).pipe(
      tap(data => this.cacheHomeRow.set(className, data))
    );
  }

  getHome(): Observable<HomeData> {
    if (this.cacheHome) {
      return of(this.cacheHome);
    }
    return this.http.get<HomeData>(`${this.apiUrl}/home`).pipe(
      tap(data => this.cacheHome = data)
    );
  }

  searchDropdown(q: string): Observable<SearchResult[]> {
    if (this.cacheSearch.has(q)) {
      return of(this.cacheSearch.get(q)!);
    }
    return this.http.get<SearchResult[]>(`${this.apiUrl}/search?q=${encodeURIComponent(q)}`).pipe(
      tap(data => this.cacheSearch.set(q, data))
    );
  }

  searchFull(q: string): Observable<CarDetail[]> {
    if (this.cacheSearchFull.has(q)) {
      return of(this.cacheSearchFull.get(q)!);
    }
    return this.http.get<CarDetail[]>(`${this.apiUrl}/search/full?q=${encodeURIComponent(q)}`).pipe(
      tap(data => this.cacheSearchFull.set(q, data))
    );
  }

}
