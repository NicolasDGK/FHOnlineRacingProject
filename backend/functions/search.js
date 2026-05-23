const { pool } = require('../shared/db');
const { validateApiKey, unauthorizedResponse, corsHeaders } = require('../shared/auth');

module.exports.handler = async (event) => {
  if (!validateApiKey(event)) return unauthorizedResponse();

  const q = event.queryStringParameters?.q;
  if (!q || q.trim().length < 2 || q.trim().length > 100) {
    return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify([]) };
  }

  try {
    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.s3_image_url, c.is_meta,
             t.class, COUNT(t.id) AS tune_count
      FROM cars c
      JOIN tunes t ON t.car_id = c.id
      WHERE c.name ILIKE $1
      GROUP BY c.id, c.name, c.image_url, c.s3_image_url, c.is_meta, t.class
      ORDER BY c.name, t.class
      LIMIT 20
    `, [`%${q.trim()}%`]);

    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'Cache-Control': 'public, max-age=120' },
      body: JSON.stringify(rows.map(r => ({
        car_id:     r.car_id,
        car_name:   r.car_name,
        image_url:  r.s3_image_url || r.image_url,
        is_meta:    r.is_meta,
        class:      r.class,
        tune_count: parseInt(r.tune_count, 10)
      })))
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Error en búsqueda' })
    };
  }
};