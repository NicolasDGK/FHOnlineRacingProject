// backend/index.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
app.use(cors());
app.use(express.json());

// ── Helper ─────────────────────────────────────────────────
function buildCarDetails(rows, targetClass = null) {
  const map = new Map();
  for (const row of rows) {
    // Clave: (car_id, clase) — así el mismo auto aparece una vez por clase
    const key = `${row.car_id}_${row.tune_class}`;
    if (!map.has(key)) {
      map.set(key, {
        id:        row.car_id,
        name:      row.car_name,
        image_url: row.image_url,
        class:     targetClass ?? row.tune_class,
        isMeta:    row.is_meta,
        tunes:     []
      });
    }
    if (row.tune_id) {
      map.get(key).tunes.push({
        id:         row.tune_id,
        car_id:     row.car_id,
        class:      row.tune_class,
        creator:    row.creator,
        share_code: row.share_code,
        types:      row.types,
        notes:      row.notes ?? undefined
      });
    }
  }
  return [...map.values()].sort((a, b) =>
    a.name.localeCompare(b.name) || a.class.localeCompare(b.class)
  );
}

// ── GET /api/cars?class=S1 ──────────────────────────────────
app.get('/api/cars', async (req, res) => {
  const { class: cls } = req.query;
  if (!cls) return res.status(400).json({ error: 'Falta ?class=' });
  try {
    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.is_meta,
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id AND t.class = $1
      ORDER BY c.name, t.id
    `, [cls.toUpperCase()]);
    res.json(buildCarDetails(rows, cls.toUpperCase()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los autos' });
  }
});

// ── GET /api/cars/home-row?class=S1 ────────────────────────
app.get('/api/cars/home-row', async (req, res) => {
  const { class: cls } = req.query;
  if (!cls) return res.status(400).json({ error: 'Falta ?class=' });
  try {
    const clsUp = cls.toUpperCase();
    const { rows: idRows } = await pool.query(`
      SELECT DISTINCT c.id, c.is_meta
      FROM cars c JOIN tunes t ON t.car_id = c.id AND t.class = $1
    `, [clsUp]);

    if (idRows.length === 0) return res.json([]);

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const metaIds    = idRows.filter(r => r.is_meta).map(r => r.id);
    const nonMetaIds = idRows.filter(r => !r.is_meta).map(r => r.id);

    const selectedIds = metaIds.length > 0
      ? shuffle([shuffle(metaIds)[0], ...shuffle(nonMetaIds).slice(0, 7)])
      : shuffle(nonMetaIds).slice(0, 8);

    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.is_meta,
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id AND t.class = $1
      WHERE c.id = ANY($2)
      ORDER BY c.name, t.id
    `, [clsUp, selectedIds]);

    res.json(buildCarDetails(rows, clsUp));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error home-row' });
  }
});

// ── GET /api/search?q=ferrari  (dropdown — solo counts) ────
// Respuesta liviana para el dropdown del navbar
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json([]);
  try {
    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.is_meta,
             t.class, COUNT(t.id) AS tune_count
      FROM cars c
      JOIN tunes t ON t.car_id = c.id
      WHERE c.name ILIKE $1
      GROUP BY c.id, c.name, c.image_url, c.is_meta, t.class
      ORDER BY c.name, t.class
      LIMIT 20
    `, [`%${q.trim()}%`]);

    res.json(rows.map(r => ({
      car_id:     r.car_id,
      car_name:   r.car_name,
      image_url:  r.image_url,
      is_meta:    r.is_meta,
      class:      r.class,
      tune_count: parseInt(r.tune_count, 10)
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en búsqueda' });
  }
});

// ── GET /api/search/full?q=ferrari  (search-results page) ──
// Respuesta completa con tunes para el componente search-results
app.get('/api/search/full', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json([]);
  try {
    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.is_meta,
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id
      WHERE c.name ILIKE $1
      ORDER BY c.name, t.class, t.id
    `, [`%${q.trim()}%`]);

    res.json(buildCarDetails(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en búsqueda completa' });
  }
});

// ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend en http://localhost:${PORT}`));
