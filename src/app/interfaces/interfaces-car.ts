// src/app/interfaces/interfaces-car.ts

/** Tabla `cars` en PostgreSQL */
export interface Car {
  id: number;
  name: string;
  image_url: string;
  is_meta: boolean; // ← movido desde tunes a cars
}

/** Tabla `tunes` en PostgreSQL */
export interface Tune {
  id: number;
  car_id: number;
  class: string;
  creator: string;
  share_code: string;
  types: string[];
  notes?: string;
}

/**
 * Vista del FRONTEND: un auto en una clase específica con sus tunes.
 * isMeta viene directamente de cars.is_meta (no depende de la clase).
 */
export interface CarDetail {
  id: number;
  name: string;
  image_url: string;
  class: string;
  isMeta: boolean; // ← refleja cars.is_meta
  tunes: Tune[];
}
