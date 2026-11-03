import fs from 'fs';
const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

const routes = [];
const regex = /router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  // get line number
  const upTo = content.substring(0, match.index);
  const lineNum = upTo.split('\n').length;
  routes.push({ method: match[1].toUpperCase(), path: match[2], lineNum });
}

console.log('Total routes found:', routes.length);
routes.forEach(r => console.log(`${String(r.lineNum).padStart(5)}: ${r.method.padEnd(7)} ${r.path}`));

