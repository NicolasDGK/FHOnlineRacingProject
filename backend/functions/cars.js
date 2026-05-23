const { pool } = require('../shared/db');
const { buildCarDetails } = require('../shared/buildCarDetails');
const { validateApiKey, unauthorizedResponse, corsHeaders } = require('../shared/auth');
const { isValidClass } = require('../shared/validClasses');

module.exports.handler = async (event) => {
  if (!validateApiKey(event)) return unauthorizedResponse();

  const cls = event.queryStringParameters?.class;
  if (!isValidClass(cls)) {
    return {
      statusCode: 400,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Invalid class' })
    };
  }

  try {
    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.s3_image_url, c.is_meta,
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id AND t.class = $1
      ORDER BY c.name, t.id
    `, [cls.toUpperCase()]);

    return {
      statusCode: 200,
      headers: { ...corsHeaders(), 'Cache-Control': 'public, max-age=300' },
      body: JSON.stringify(buildCarDetails(rows, cls.toUpperCase()))
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Error al obtener los autos' })
    };
  }
};