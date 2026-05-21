const request = require('supertest');
const { app, pool } = require('../index');

jest.setTimeout(15000);

const API_KEY = process.env.API_KEY || 'test-key';

test('GET /api/cars sin ?class= retorna 400', async () => {
  const res = await request(app)
    .get('/api/cars')
    .set('x-api-key', API_KEY);
  expect(res.status).toBe(400);
});

test('GET /api/cars con clase válida retorna 200', async () => {
  const res = await request(app)
    .get('/api/cars?class=S1')
    .set('x-api-key', API_KEY);
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('GET /api/search con q corta retorna array vacío', async () => {
  const res = await request(app)
    .get('/api/search?q=a')
    .set('x-api-key', API_KEY);
  expect(res.status).toBe(200);
  expect(res.body).toEqual([]);
});

afterAll(async () => {
  await pool.end();
});