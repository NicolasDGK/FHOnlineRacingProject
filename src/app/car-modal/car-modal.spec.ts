import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarModalComponent } from './car-modal'; 

describe('CarModalComponent', () => {
  let component: CarModalComponent;
  let fixture: ComponentFixture<CarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importamos la clase correcta
      imports: [CarModalComponent] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarModalComponent);
    component = fixture.componentInstance;
    
    // Opcional: Mock de datos iniciales para evitar errores de template
    component.car = {
      id: 1,
      name: 'Test Car',
      image_url: '',
      class: 'S1',
      isMeta: false,
      tunes: []
    };

    fixture.detectChanges(); // Disparamos la detección de cambios inicial
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});