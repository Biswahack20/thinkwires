import fs from 'fs';
const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');

function findHeaders() {
  lines.forEach((line, i) => {
    if (line.startsWith('// ---') || line.startsWith('// ===') || line.startsWith('// GET /api') || line.startsWith('// POST /api')) {
      console.log(`${String(i + 1).padStart(5)}: ${line}`);
    }
  });
}
findHeaders();

