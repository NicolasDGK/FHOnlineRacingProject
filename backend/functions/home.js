const { pool } = require('../shared/db');
const { buildCarDetails } = require('../shared/buildCarDetails');
const { validateApiKey, unauthorizedResponse, corsHeaders } = require('../shared/auth');

module.exports.handler = async (event) => {
  if (!validateApiKey(event)) return unauthorizedResponse();

  const classes = ['S2', 'S1', 'A', 'B', 'C', 'D'];
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  try {
    const { rows: idRows } = await pool.query(`
      SELECT DISTINCT c.id, c.is_meta, t.class AS tune_class
      FROM cars c JOIN tunes t ON t.car_id = c.id
      WHERE t.class = ANY($1)
    `, [classes]);

    const selectedIds = [];
    for (const cls of classes) {
      const clsRows    = idRows.filter(r => r.tune_class === cls);
      const metaIds    = clsRows.filter(r => r.is_meta).map(r => r.id);
      const nonMetaIds = clsRows.filter(r => !r.is_meta).map(r => r.id);

      const picked = metaIds.length > 0
        ? shuffle([shuffle(metaIds)[0], ...shuffle(nonMetaIds).slice(0, 7)])
        : shuffle(nonMetaIds).slice(0, 8);

      selectedIds.push(...picked);
    }

    const { rows } = await pool.query(`
      SELECT c.id AS car_id, c.name AS car_name, c.image_url, c.s3_image_url, c.is_meta,
             t.id AS tune_id, t.class AS tune_class, t.creator,
             t.share_code, t.types, t.notes
      FROM cars c
      JOIN tunes t ON t.car_id = c.id AND t.class = ANY($1)
      WHERE c.id = ANY($2)
      ORDER BY t.class, c.name, t.id
    `, [classes, [...new Set(selectedIds)]]);

    const result = {};
    for (const cls of classes) {
      const clsRows = rows.filter(r => r.tune_class === cls);
      result[cls] = buildCarDetails(clsRows, cls);
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Error en home' })
    };
  }
};