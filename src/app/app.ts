// src/app/app.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, switchMap, catchError, filter } from 'rxjs/operators';

export interface SearchResult {
  car_id: number;
  car_name: string;
  image_url: string;
  is_meta: boolean;
  class: string;
  tune_count: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {

  navClasses = [
    { label: 'X',  color: '#40c038' },
    { label: 'S2', color: '#3e58b2' },
    { label: 'S1', color: '#a95ec7' },
    { label: 'A',  color: '#ea3357' },
    { label: 'B',  color: '#f1631c' },
    { label: 'C',  color: '#ffc638' },
    { label: 'D',  color: '#6ec1e3' },
  ];

  isFH5Active = false;
  searchQuery = '';
  dropdownResults: SearchResult[] = [];
  showDropdown = false;

  private input$ = new Subject<string>();
  private subs = new Subscription();

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const isFH5 = (url: string) =>
      url === '/' || url === '/home' || url.startsWith('/fh5/');

    this.isFH5Active = isFH5(this.router.url);
    this.subs.add(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e: any) => {
          this.isFH5Active = isFH5(e.urlAfterRedirects);
        })
    );

    // Dropdown: reacciona mientras escribís
    // Sin distinctUntilChanged — así siempre refresca aunque borres y reescribas lo mismo
    this.subs.add(
      this.input$.pipe(
        debounceTime(220),
        switchMap(q => {
          if (q.trim().length < 2) return of([]);
          return this.http
            .get<SearchResult[]>(
              `https://industrious-appreciation-production-7c96.up.railway.app/api/search?q=${encodeURIComponent(q.trim())}`
            )
            .pipe(catchError(() => of([])));
        })
      ).subscribe(results => {
        this.dropdownResults = results;
        // Solo mostrar si el input todavía tiene texto
        this.showDropdown = this.searchQuery.trim().length >= 2;
      })
    );
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  // Llamado en cada keystroke via (ngModelChange)
  onSearchInput(): void {
    const q = this.searchQuery.trim();
    if (!q) {
      this.dropdownResults = [];
      this.showDropdown = false;
      return;
    }
    this.showDropdown = true; // mostrar dropdown inmediatamente (con resultados del query anterior)
    this.input$.next(q);     // disparar la búsqueda con debounce
  }

  // Enter o click en la lupa → ir a search-results sin abrir modal
  submitSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.hideDropdown();
    this.router.navigate(['/fh5/search'], { queryParams: { q } });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submitSearch();
  }

  // Click en un item del dropdown → ir a search-results Y abrir ese modal
  selectResult(r: SearchResult): void {
    const q = this.searchQuery.trim();
    this.hideDropdown();
    this.router.navigate(['/fh5/search'], {
      queryParams: { q, openCar: r.car_id, openClass: r.class }
    });
  }

  hideDropdown(): void {
    this.showDropdown = false;
    this.dropdownResults = [];
    this.searchQuery = '';
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('.search-box')) this.hideDropdown();
  }
}
