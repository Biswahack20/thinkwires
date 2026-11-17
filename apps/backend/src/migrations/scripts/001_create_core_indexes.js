/**
 * Migration: 001_create_core_indexes.js
 * Creates performance indexes across core collections for instant search and filtering (DB-01, DB-02)
 */

export const up = async ({ db }) => {
  console.log('   Creating performance indexes on core collections...');

  // Job Requirements
  await db
    .collection('jobrequirements')
    .createIndex({ department: 1, location: 1, workMode: 1 });
  await db.collection('jobrequirements').createIndex({ status: 1 });
  await db.collection('jobrequirements').createIndex({ requiredSkills: 1 });

  // Candidates
  await db.collection('candidates').createIndex({ technicalSkills: 1 });
  await db.collection('candidates').createIndex({ experience: 1 });
  await db.collection('candidates').createIndex({ status: 1 });

  // Articles
  await db.collection('articles').createIndex({ category: 1, status: 1 });

  // Pages
  await db.collection('pages').createIndex({ category: 1, status: 1 });

  console.log('   Performance indexes established successfully.');
};

export const verify = async ({ db }) => {
  console.log('   Verifying core indexes existence...');
  const jobIndexes = await db.collection('jobrequirements').indexes();
  const candIndexes = await db.collection('candidates').indexes();
  const artIndexes = await db.collection('articles').indexes();
  const pageIndexes = await db.collection('pages').indexes();

  const hasJobStatus = jobIndexes.some((i) => i.key && i.key.status === 1);
  const hasCandStatus = candIndexes.some((i) => i.key && i.key.status === 1);
  const hasArtCategory = artIndexes.some((i) => i.key && i.key.category === 1 && i.key.status === 1);
  const hasPageCategory = pageIndexes.some((i) => i.key && i.key.category === 1 && i.key.status === 1);

  if (!hasJobStatus || !hasCandStatus || !hasArtCategory || !hasPageCategory) {
    throw new Error('Verification failed: Required core performance indexes are missing from database.');
  }
  console.log('   ✔ Core performance indexes verified.');
};

export const down = async ({ db }) => {
  console.log('   Reverting performance indexes...');
  try {
    await db
      .collection('jobrequirements')
      .dropIndex('department_1_location_1_workMode_1');
    await db.collection('jobrequirements').dropIndex('status_1');
    await db.collection('jobrequirements').dropIndex('requiredSkills_1');
  } catch {}
  try {
    await db.collection('candidates').dropIndex('technicalSkills_1');
    await db.collection('candidates').dropIndex('experience_1');
    await db.collection('candidates').dropIndex('status_1');
  } catch {}
  try {
    await db.collection('articles').dropIndex('category_1_status_1');
  } catch {}
  try {
    await db.collection('pages').dropIndex('category_1_status_1');
  } catch {}
};
