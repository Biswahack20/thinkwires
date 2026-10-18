/**
 * Migration: 001_extract_tech_stack_model.js
 * Extracts techStack from Page 'home' data into a dedicated 'techstacks' collection
 */

const DEFAULT_STACKS = [
  { name: 'SAP', category: 'ERP & Enterprise Core', icon: 'hub', order: 1 },
  { name: 'Amazon Web Services (AWS)', category: 'Cloud & Infrastructure', icon: 'cloud', order: 2 },
  { name: 'Microsoft Azure', category: 'Cloud & Infrastructure', icon: 'cloud_queue', order: 3 },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud & Infrastructure', icon: 'cloud_done', order: 4 },
  { name: 'Salesforce', category: 'ERP & Enterprise Core', icon: 'corporate_fare', order: 5 },
  { name: 'Oracle Cloud', category: 'Cloud & Infrastructure', icon: 'database', order: 6 },
  { name: 'Snowflake', category: 'Data & Analytics', icon: 'ac_unit', order: 7 },
  { name: 'Kubernetes', category: 'DevOps & Cloud Native', icon: 'view_in_ar', order: 8 },
  { name: 'Docker', category: 'DevOps & Cloud Native', icon: 'deployed_code', order: 9 },
  { name: 'React.js', category: 'Modern Fullstack & AI', icon: 'code', order: 10 },
  { name: 'Node.js', category: 'Modern Fullstack & AI', icon: 'terminal', order: 11 },
  { name: 'Python / AI', category: 'Modern Fullstack & AI', icon: 'psychology', order: 12 },
  { name: 'Java Spring Boot', category: 'Modern Fullstack & AI', icon: 'developer_mode', order: 13 },
  { name: 'PostgreSQL', category: 'Data & Analytics', icon: 'storage', order: 14 },
  { name: 'Terraform', category: 'DevOps & Cloud Native', icon: 'construction', order: 15 },
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export const up = async ({ db }) => {
  const techStackCol = db.collection('techstacks');
  const pagesCol = db.collection('pages');

  // 1. Ensure indexes
  await techStackCol.createIndex({ slug: 1 }, { unique: true });
  await techStackCol.createIndex({ category: 1, order: 1 });

  // 2. Fetch existing techStack from Page 'home'
  const homePage = await pagesCol.findOne({ slug: 'home' });
  const existingNames = Array.isArray(homePage?.data?.techStack)
    ? homePage.data.techStack
    : [];

  const itemsToInsert = [];
  const nameMap = new Map(DEFAULT_STACKS.map((s) => [s.name.toLowerCase(), s]));

  // Combine items from home page data and default list
  const combinedNames = [
    ...new Set([
      ...DEFAULT_STACKS.map((s) => s.name),
      ...existingNames.filter((n) => typeof n === 'string'),
    ]),
  ];

  combinedNames.forEach((name, index) => {
    const meta = nameMap.get(name.toLowerCase()) || {
      name,
      category: 'Cloud & Infrastructure',
      icon: 'layers',
      order: index + 1,
    };

    itemsToInsert.push({
      name,
      slug: slugify(name),
      category: meta.category,
      icon: meta.icon,
      order: meta.order || index + 1,
      isFeatured: true,
      isActive: true,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  });

  for (const item of itemsToInsert) {
    await techStackCol.updateOne(
      { slug: item.slug },
      { $set: item },
      { upsert: true }
    );
  }

  console.log(`   Migrated ${itemsToInsert.length} tech stack records to 'techstacks' collection.`);
};

export const down = async ({ db }) => {
  console.log("   Dropping 'techstacks' collection...");
  try {
    await db.collection('techstacks').drop();
    console.log("   Successfully dropped 'techstacks' collection.");
  } catch (err) {
    if (err.codeName !== 'NamespaceNotFound') {
      throw err;
    }
  }
};
