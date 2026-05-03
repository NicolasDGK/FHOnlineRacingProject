import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

// Corregido el nombre de la importación
import { HomeComponent } from './home'; 

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Corregido el nombre de la clase
      imports: [HomeComponent],
      providers: [
        provideHttpClient(), // Necesario si CarService usa HttpClient
        provideRouter([])    // Necesario porque usas RouterModule/RouterLink
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});