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

  const clsUp = cls.toUpperCase();

  try {
    const { rows: idRows } = await pool.query(`
      SELECT DISTINCT c.id, c.is_meta
      FROM cars c JOIN tunes t ON t.car_id = c.id AND t.class = $1
    `, [clsUp]);

    if (idRows.length === 0) {
      return { statusCode: 200, headers: corsHeaders(), body: JSON.stringify([]) };
    }

    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const metaIds    = idRows.filter(r => r.is_meta).map(r => r.id);
    const nonMetaIds = idRows.filter(r => !r.is_meta).map(r => r.id);

    const selectedIds = metaIds.length > 0
      ? shuffle([shuffle(metaIds)[0], ...shuffle(nonMetaIds).slice(0, 7)])
      : shuffle(nonMetaIds).slice(0, 8);

    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.s3_image_url, c.is_meta,
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id AND t.class = $1
      WHERE c.id = ANY($2)
      ORDER BY c.name, t.id
    `, [clsUp, selectedIds]);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(buildCarDetails(rows, clsUp))
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Error home-row' })
    };
  }
};