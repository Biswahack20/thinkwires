/**
 * Canonical Technical Skills Taxonomy for Thinkwires
 * Categorized catalog of standard software engineering skills.
 * Strictly plain text with no emojis.
 */

export const SKILLS_TAXONOMY = [
  // Frontend & Web Engineering
  { name: 'React', category: 'Frontend' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Nuxt.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Svelte', category: 'Frontend' },
  { name: 'SvelteKit', category: 'Frontend' },
  { name: 'HTML5', category: 'Frontend' },
  { name: 'CSS3', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Bootstrap', category: 'Frontend' },
  { name: 'Sass / SCSS', category: 'Frontend' },
  { name: 'Redux Toolkit', category: 'Frontend' },
  { name: 'Zustand', category: 'Frontend' },
  { name: 'Three.js', category: 'Frontend' },
  { name: 'WebGL', category: 'Frontend' },
  { name: 'Vite', category: 'Frontend' },
  { name: 'Webpack', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },
  { name: 'Remix', category: 'Frontend' },
  { name: 'Astro', category: 'Frontend' },
  { name: 'Shadcn UI', category: 'Frontend' },
  { name: 'Material UI (MUI)', category: 'Frontend' },
  { name: 'WebSockets', category: 'Frontend' },
  { name: 'Progressive Web Apps (PWA)', category: 'Frontend' },
  { name: 'Micro-frontends', category: 'Frontend' },

  // Backend & Core Systems
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'Python', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Go (Golang)', category: 'Backend' },
  { name: 'Java', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'C#', category: 'Backend' },
  { name: '.NET Core', category: 'Backend' },
  { name: 'C++', category: 'Backend' },
  { name: 'C', category: 'Backend' },
  { name: 'Rust', category: 'Backend' },
  { name: 'Ruby on Rails', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },
  { name: 'Laravel', category: 'Backend' },
  { name: 'Elixir', category: 'Backend' },
  { name: 'Phoenix', category: 'Backend' },
  { name: 'Scala', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },
  { name: 'REST APIs', category: 'Backend' },
  { name: 'gRPC', category: 'Backend' },
  { name: 'Kafka', category: 'Backend' },
  { name: 'RabbitMQ', category: 'Backend' },
  { name: 'Apache Spark', category: 'Backend' },
  { name: 'Apache Flink', category: 'Backend' },
  { name: 'Celery', category: 'Backend' },
  { name: 'Event-Driven Architecture', category: 'Backend' },
  { name: 'Microservices', category: 'Backend' },

  // Cloud & DevOps Engineering
  { name: 'AWS', category: 'Cloud & DevOps' },
  { name: 'Amazon EC2', category: 'Cloud & DevOps' },
  { name: 'Amazon S3', category: 'Cloud & DevOps' },
  { name: 'Amazon ECS', category: 'Cloud & DevOps' },
  { name: 'Amazon EKS', category: 'Cloud & DevOps' },
  { name: 'AWS Lambda', category: 'Cloud & DevOps' },
  { name: 'AWS CloudFormation', category: 'Cloud & DevOps' },
  { name: 'Microsoft Azure', category: 'Cloud & DevOps' },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps' },
  { name: 'Kubernetes', category: 'Cloud & DevOps' },
  { name: 'Docker', category: 'Cloud & DevOps' },
  { name: 'Terraform', category: 'Cloud & DevOps' },
  { name: 'Ansible', category: 'Cloud & DevOps' },
  { name: 'Helm', category: 'Cloud & DevOps' },
  { name: 'CI/CD Pipelines', category: 'Cloud & DevOps' },
  { name: 'GitHub Actions', category: 'Cloud & DevOps' },
  { name: 'GitLab CI', category: 'Cloud & DevOps' },
  { name: 'Jenkins', category: 'Cloud & DevOps' },
  { name: 'ArgoCD', category: 'Cloud & DevOps' },
  { name: 'Prometheus', category: 'Cloud & DevOps' },
  { name: 'Grafana', category: 'Cloud & DevOps' },
  { name: 'Datadog', category: 'Cloud & DevOps' },
  { name: 'OpenTelemetry', category: 'Cloud & DevOps' },
  { name: 'Cloudflare', category: 'Cloud & DevOps' },
  { name: 'Linux Administration', category: 'Cloud & DevOps' },
  { name: 'Bash / Shell Scripting', category: 'Cloud & DevOps' },
  { name: 'Nginx', category: 'Cloud & DevOps' },
  { name: 'Service Mesh (Istio)', category: 'Cloud & DevOps' },
  { name: 'Serverless Architecture', category: 'Cloud & DevOps' },

  // Databases & Storage
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'MongoDB', category: 'Databases' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'Redis', category: 'Databases' },
  { name: 'Elasticsearch', category: 'Databases' },
  { name: 'DynamoDB', category: 'Databases' },
  { name: 'Cassandra', category: 'Databases' },
  { name: 'Snowflake', category: 'Databases' },
  { name: 'BigQuery', category: 'Databases' },
  { name: 'Amazon Redshift', category: 'Databases' },
  { name: 'SQLite', category: 'Databases' },
  { name: 'Neo4j (Graph DB)', category: 'Databases' },
  { name: 'Supabase', category: 'Databases' },
  { name: 'Firebase', category: 'Databases' },
  { name: 'Prisma ORM', category: 'Databases' },
  { name: 'Sequelize ORM', category: 'Databases' },
  { name: 'Mongoose ODM', category: 'Databases' },
  { name: 'ClickHouse', category: 'Databases' },
  { name: 'CockroachDB', category: 'Databases' },

  // AI / ML & Data Science
  { name: 'GenAI & LLMs', category: 'AI & Data' },
  { name: 'PyTorch', category: 'AI & Data' },
  { name: 'TensorFlow', category: 'AI & Data' },
  { name: 'LangChain', category: 'AI & Data' },
  { name: 'LlamaIndex', category: 'AI & Data' },
  { name: 'OpenAI API', category: 'AI & Data' },
  { name: 'Hugging Face', category: 'AI & Data' },
  { name: 'Vector Databases', category: 'AI & Data' },
  { name: 'Pinecone', category: 'AI & Data' },
  { name: 'Qdrant', category: 'AI & Data' },
  { name: 'ChromaDB', category: 'AI & Data' },
  { name: 'Weaviate', category: 'AI & Data' },
  { name: 'Scikit-Learn', category: 'AI & Data' },
  { name: 'Pandas', category: 'AI & Data' },
  { name: 'NumPy', category: 'AI & Data' },
  { name: 'Computer Vision', category: 'AI & Data' },
  { name: 'OpenCV', category: 'AI & Data' },
  { name: 'Natural Language Processing (NLP)', category: 'AI & Data' },
  { name: 'MLOps', category: 'AI & Data' },
  { name: 'dbt (data build tool)', category: 'AI & Data' },
  { name: 'Airflow', category: 'AI & Data' },

  // Enterprise & ERP
  { name: 'SAP ABAP', category: 'Enterprise / ERP' },
  { name: 'SAP S/4HANA', category: 'Enterprise / ERP' },
  { name: 'SAP Fiori', category: 'Enterprise / ERP' },
  { name: 'SAP HANA', category: 'Enterprise / ERP' },
  { name: 'SAP MM', category: 'Enterprise / ERP' },
  { name: 'SAP SD', category: 'Enterprise / ERP' },
  { name: 'Salesforce Development', category: 'Enterprise / ERP' },
  { name: 'Salesforce Apex', category: 'Enterprise / ERP' },
  { name: 'Salesforce Lightning (LWC)', category: 'Enterprise / ERP' },
  { name: 'Adobe Experience Manager (AEM)', category: 'Enterprise / ERP' },
  { name: 'ServiceNow', category: 'Enterprise / ERP' },
  { name: 'Workday Integration', category: 'Enterprise / ERP' },
  { name: 'Oracle ERP Cloud', category: 'Enterprise / ERP' },
  { name: 'Microsoft Dynamics 365', category: 'Enterprise / ERP' },
  { name: 'NetSuite', category: 'Enterprise / ERP' },
  { name: 'MuleSoft', category: 'Enterprise / ERP' },

  // Mobile Application Development
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Dart', category: 'Mobile' },
  { name: 'Swift', category: 'Mobile' },
  { name: 'iOS Development', category: 'Mobile' },
  { name: 'SwiftUI', category: 'Mobile' },
  { name: 'Kotlin', category: 'Mobile' },
  { name: 'Android Development', category: 'Mobile' },
  { name: 'Jetpack Compose', category: 'Mobile' },
  { name: 'Expo', category: 'Mobile' },
  { name: 'Ionic', category: 'Mobile' },

  // Quality Assurance & Automated Testing
  { name: 'Playwright', category: 'Testing & QA' },
  { name: 'Cypress', category: 'Testing & QA' },
  { name: 'Vitest', category: 'Testing & QA' },
  { name: 'Jest', category: 'Testing & QA' },
  { name: 'React Testing Library', category: 'Testing & QA' },
  { name: 'Selenium', category: 'Testing & QA' },
  { name: 'Appium', category: 'Testing & QA' },
  { name: 'Postman / Newman', category: 'Testing & QA' },
  { name: 'k6 (Performance Testing)', category: 'Testing & QA' },
  { name: 'JMeter', category: 'Testing & QA' },
  { name: 'Axe-core (Accessibility)', category: 'Testing & QA' },
  { name: 'SonarQube', category: 'Testing & QA' },

  // Architecture, Security & Governance
  { name: 'System Design', category: 'Architecture' },
  { name: 'High Availability Architecture', category: 'Architecture' },
  { name: 'Domain-Driven Design (DDD)', category: 'Architecture' },
  { name: 'OAuth 2.0 / OpenID Connect', category: 'Security' },
  { name: 'Web Security (OWASP)', category: 'Security' },
  { name: 'Penetration Testing', category: 'Security' },
  { name: 'Cryptographic Protocols', category: 'Security' },
  { name: 'Zero Trust Architecture', category: 'Security' },
  { name: 'SOC 2 Compliance', category: 'Security' },
  { name: 'GDPR Data Compliance', category: 'Security' },
];

/**
 * Perform ranked search for technical skills.
 * Handles single-letter triggers and multi-term queries.
 *
 * Ranking criteria:
 * 1. Prefix match (starts with query)
 * 2. Word boundary match (word inside skill starts with query)
 * 3. Substring match
 *
 * @param {string} query - Search term (even 1 character)
 * @param {number} limit - Maximum suggestions to return (default: 8)
 * @param {Array<string>} existingSkills - Currently selected skills to omit
 * @returns {Array<{ name: string, category: string, matchType: string }>}
 */
export function searchSkills(query = '', limit = 8, existingSkills = []) {
  if (!query || typeof query !== 'string') return [];
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery.length === 0) return [];

  const existingLowerSet = new Set(
    existingSkills.map((s) => (typeof s === 'string' ? s.trim().toLowerCase() : ''))
  );

  const prefixMatches = [];
  const wordBoundaryMatches = [];
  const substringMatches = [];

  for (let i = 0; i < SKILLS_TAXONOMY.length; i++) {
    const item = SKILLS_TAXONOMY[i];
    const nameLower = item.name.toLowerCase();

    // Skip if already selected
    if (existingLowerSet.has(nameLower)) continue;

    // 1. Prefix match (starts with cleanQuery)
    if (nameLower.startsWith(cleanQuery)) {
      prefixMatches.push({ ...item, matchType: 'prefix' });
      continue;
    }

    // 2. Word boundary match (e.g. 'js' matches 'Vue.js' or 'Next.js', 'sql' matches 'PostgreSQL')
    const words = nameLower.split(/[\s/.,()+-]+/);
    const hasWordPrefix = words.some((w) => w.startsWith(cleanQuery));
    if (hasWordPrefix) {
      wordBoundaryMatches.push({ ...item, matchType: 'word' });
      continue;
    }

    // 3. Substring match
    if (nameLower.includes(cleanQuery)) {
      substringMatches.push({ ...item, matchType: 'substring' });
    }
  }

  // Combine ranked arrays
  const combined = [
    ...prefixMatches,
    ...wordBoundaryMatches,
    ...substringMatches,
  ];

  return combined.slice(0, limit);
}

export default SKILLS_TAXONOMY;

