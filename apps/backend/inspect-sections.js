import fs from 'fs';
const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');

function inspectRange(start, end) {
  console.log(`=== Lines ${start} to ${end} ===`);
  console.log(lines.slice(start - 1, end).join('\n'));
}

// Let's check:
// 1. Bench: 985 to 1900
console.log('BENCH START:', lines.slice(980, 1020).join('\n'));
console.log('BENCH END:', lines.slice(1885, 1905).join('\n'));

