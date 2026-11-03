import fs from 'fs';
const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');

// Print first 150 lines to inspect imports, helper functions, state, etc.
console.log(lines.slice(0, 150).join('\n'));

