const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

console.log('API_URL defined:', apiUrl !== undefined);
console.log('API_KEY defined:', apiKey !== undefined);

const content = [
  'export const environment = {',
  '  production: true,',
  "  apiUrl: '" + apiUrl + "',",
  "  apiKey: '" + apiKey + "'",
  '};',
  ''
].join('\n');

fs.writeFileSync(
  path.join(__dirname, '../src/environments/environment.prod.ts'),
  content
);

console.log('environment.prod.ts correctly generated');
console.log('Content written:', content);