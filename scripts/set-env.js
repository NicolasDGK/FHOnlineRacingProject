const fs = require('fs');
const path = require('path');

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