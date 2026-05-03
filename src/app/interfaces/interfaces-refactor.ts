// ============================================
// INTERFACES ALINEADAS CON POSTGRESQL
// ============================================

/**
 * Tabla `cars`: Solo información del vehículo
 * No tiene nada que ver con clases o tunes
 */
export interface Car {
  id: number;
  name: string;
  image_url: string;
}

/**
 * Tabla `tunes`: Configuraciones de tuneo para un auto en una clase
 * 
 * Estructura BD:
 * - id: PK
 * - car_id: FK → cars.id
 * - class: La clase en la que este tune aplica (S2, S1, A, B, C, D)
 * - share_code: Código para compartir el tune en el juego
 * - types: TEXT[] → array de tipos de uso (road, offroad, allround, rain, etc.)
 */
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
 * INTERFAZ DERIVADA: Combina un Car con sus tunes para una clase específica
 * 
 * Esto es lo que el FRONTEND usa para mostrar un auto en una clase.
 * Se construye combinando datos de `cars` + `tunes` filtrados por clase.
 * 
 * Ejemplo:
 * - Dodge Viper 13 AE existe en cars.id = 5
 * - En S1: tiene 3 tunes diferentes
 * - En S2: tiene 2 tunes diferentes
 * 
 * Cuando mostrámos "Viper en S1":
 * CarInClass = {
 *   car: { id: 5, name: 'Dodge Viper 13 AE', image_url: '...' },
 *   classData: { class: 'S1', isMeta: true, tunes: [...] }
 * }
 */
export interface CarInClass {
  car: Car;
  classData: {
    class: string;
    isMeta: boolean; // ← TRUE si este auto es META en ESTA clase
    tunes: Tune[]; // Todos los tunes para este auto en esta clase
  };
}

/**
 * VISTA ALTERNATIVA (más plana, para templates simples):
 * Si prefieres una estructura más sencilla para pasar al modal
 */
export interface CarDetail {
  id: number;
  name: string;
  image_url: string;
  class: string;
  isMeta: boolean; // META en esta clase específica
  tunes: Tune[];
}
