const { pool } = require('../shared/db');
const { buildCarDetails } = require('../shared/buildCarDetails');
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
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id
      WHERE c.name ILIKE $1
      ORDER BY c.name, t.class, t.id
    `, [`%${q.trim()}%`]);

    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'Cache-Control': 'public, max-age=300' },
      body: JSON.stringify(buildCarDetails(rows))
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Error en búsqueda completa' })
    };
  }
};