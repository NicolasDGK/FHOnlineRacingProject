function buildCarDetails(rows, targetClass = null) {
  const map = new Map();
  for (const row of rows) {
    const key = `${row.car_id}_${row.tune_class}`;
    if (!map.has(key)) {
      map.set(key, {
        id:        row.car_id,
        name:      row.car_name,
        image_url: row.s3_image_url || row.image_url,
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

module.exports = { buildCarDetails };