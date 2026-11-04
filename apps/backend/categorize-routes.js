import fs from 'fs';
const content = fs.readFileSync('c:/PROJECTS/thinkwires/apps/backend/src/routes/api.route.js', 'utf8');
const lines = content.split('\n');

const routes = [];
const regex = /router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const upTo = content.substring(0, match.index);
  const lineNum = upTo.split('\n').length;
  routes.push({ method: match[1].toUpperCase(), path: match[2], lineNum });
}

// Map each route to a domain
const categorized = {
  bench: [],
  industries: [],
  services: [],
  contact: [],
  articles: [],
  newsletter: [],
  other: []
};

routes.forEach(r => {
  if (r.path.startsWith('/bench')) {
    categorized.bench.push(r);
  } else if (r.path.startsWith('/industries') || r.path === '/sector-catalog') {
    categorized.industries.push(r);
  } else if (
    r.path.startsWith('/payroll') ||
    r.path.startsWith('/eor') ||
    r.path.startsWith('/staff-augmentation') ||
    r.path.startsWith('/permanent-staffing') ||
    r.path.startsWith('/executive-search')
  ) {
    categorized.services.push(r);
  } else if (r.path === '/articles/newsletter') {
    categorized.newsletter.push(r);
  } else if (r.path.startsWith('/articles')) {
    categorized.articles.push(r);
  } else if (
    r.path.startsWith('/contact') ||
    r.path === '/about/consultation' ||
    r.path === '/consultations' ||
    r.path === '/company/contact'
  ) {
    categorized.contact.push(r);
  } else {
    categorized.other.push(r);
  }
});

for (const [dom, list] of Object.entries(categorized)) {
  console.log(`=== ${dom} (${list.length}) ===`);
  list.forEach(r => console.log(`  ${String(r.lineNum).padStart(4)}: ${r.method.padEnd(6)} ${r.path}`));
}

