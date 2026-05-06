const { buildCarDetails } = require('../index');

test('retorna array vacío si no hay rows', () => {
  const resultado = buildCarDetails([]);
  expect(resultado).toEqual([]);
});

test('agrupa correctamente tunes del mismo auto', () => {
  const rows = [
    {
      car_id: 1, car_name: 'Ferrari F40', image_url: 'url.png',
      is_meta: true, tune_id: 10, tune_class: 'S1',
      creator: 'JohnDoe', share_code: '123 456 789',
      types: ['allround'], notes: null
    },
    {
      car_id: 1, car_name: 'Ferrari F40', image_url: 'url.png',
      is_meta: true, tune_id: 11, tune_class: 'S1',
      creator: 'JaneDoe', share_code: '987 654 321',
      types: ['speed'], notes: 'muy rápido'
    }
  ];

  const resultado = buildCarDetails(rows);
  expect(resultado).toHaveLength(1);         // 1 auto, no 2
  expect(resultado[0].tunes).toHaveLength(2); // con 2 tunes
  expect(resultado[0].name).toBe('Ferrari F40');
});