// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { ClassDetailComponent } from './class-detail-component/class-detail-component';
import { Fh5SearchResultsComponent } from './fh5-search-results/fh5-search-results';

export const routes: Routes = [
  { path: 'home',                  component: HomeComponent },
  { path: 'fh5/class/:className',  component: ClassDetailComponent },
  { path: 'fh5/search',            component: Fh5SearchResultsComponent },
  { path: '',     redirectTo: 'home', pathMatch: 'full' },
  { path: '**',   redirectTo: 'home' },
];
