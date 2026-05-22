const { Pool } = require('pg');
const https = require('https');
const http = require('http');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET = 'fhonlineracingproject';
const CLOUDFRONT_URL = 'https://d2u5gy9wo9tyq3.cloudfront.net';
const IMAGES_FOLDER = 'images';

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function getFilenameFromUrl(url) {
  const cleanUrl = url.split('?')[0];
  if (cleanUrl.includes('/revision/')) {
    const beforeRevision = cleanUrl.split('/revision/')[0];
    const parts = beforeRevision.split('/');
    return parts[parts.length - 1];
  }
  const parts = cleanUrl.split('/');
  return parts[parts.length - 1] || `car-${Date.now()}.png`;
}

async function migrateImages() {
  console.log('Iniciando migración de imágenes...');

  const { rows: cars } = await pool.query(
    'SELECT id, name, image_url FROM cars WHERE s3_image_url IS NULL AND image_url IS NOT NULL'
  );

  console.log(`${cars.length} autos para migrar`);

  let success = 0;
  let failed = 0;

  for (const car of cars) {
    try {
      console.log(`[${success + failed + 1}/${cars.length}] Procesando: ${car.name}`);

      const imageBuffer = await downloadImage(car.image_url);
      const filename = getFilenameFromUrl(car.image_url);
      const s3Key = `${IMAGES_FOLDER}/${filename}`;

      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: imageBuffer,
        ContentType: 'image/png'
      }));

      const s3Url = `${CLOUDFRONT_URL}/${s3Key}`;

      await pool.query(
        'UPDATE cars SET s3_image_url = $1 WHERE id = $2',
        [s3Url, car.id]
      );

      console.log(`  ✓ ${car.name} → ${s3Url}`);
      success++;

      await new Promise(r => setTimeout(r, 100));

    } catch (err) {
      console.error(`  ✗ Error con ${car.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nMigración completa: ${success} exitosos, ${failed} fallidos`);
  await pool.end();
}

migrateImages();