import fs from 'fs';
const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');

function inspectSection(title, startLine, endLine) {
  console.log(`==================== ${title} (${startLine} to ${endLine}) ====================`);
  console.log(lines.slice(startLine - 1, endLine).join('\n'));
}

// Check Industries section: 470 to 625
// Check Blog & Articles: 730 to 864
// Check Contact: 700 to 733 and 865 to 971, and 1930 to 2001
// Check Services: 2002 to 2298
// Check Openings / Home / General: 1 to 469, 626 to 703, 1903 to 1929, 2299 to 2405

console.log('Industries starts at 470, ends at 625');
console.log('Articles starts at 730, ends at 864');
console.log('Services starts at 2002, ends at 2298');

