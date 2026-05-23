const fs = require('fs');
const path = require('path');

console.log('API_URL:', process.env.API_URL);
console.log('API_KEY length:', process.env.API_KEY?.length);

const content = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}',
  apiKey: '${process.env.API_KEY}'
};
`;

fs.writeFileSync(
  path.join(__dirname, '../src/environments/environment.prod.ts'),
  content
);
console.log('environment.prod.ts correctly generated');