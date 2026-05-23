function validateApiKey(event) {
  const key = event.headers?.['x-api-key'] || event.headers?.['X-Api-Key'];
  return key === process.env.API_KEY;
}

function unauthorizedResponse() {
  return {
    statusCode: 401,
    headers: corsHeaders(),
    body: JSON.stringify({ error: 'Unauthorized' })
  };
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'https://d2u5gy9wo9tyq3.cloudfront.net',
    'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  };
}

module.exports = { validateApiKey, unauthorizedResponse, corsHeaders };