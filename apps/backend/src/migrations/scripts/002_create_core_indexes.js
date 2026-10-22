/**
 * Migration: 002_create_core_indexes.js
 * Creates performance indexes across core collections for instant search and filtering
 */

export const up = async ({ db }) => {
  console.log('   Creating performance indexes on core collections...');

  // Job Requirements
  try {
    await db
      .collection('jobrequirements')
      .createIndex({ department: 1, location: 1, workMode: 1 });
    await db.collection('jobrequirements').createIndex({ status: 1 });
    await db.collection('jobrequirements').createIndex({ requiredSkills: 1 });
  } catch (e) {
    console.warn('   Note on jobrequirements index:', e.message);
  }

  // Candidates
  try {
    await db.collection('candidates').createIndex({ technicalSkills: 1 });
    await db.collection('candidates').createIndex({ experience: 1 });
    await db.collection('candidates').createIndex({ status: 1 });
  } catch (e) {
    console.warn('   Note on candidates index:', e.message);
  }

  // Articles
  try {
    await db.collection('articles').createIndex({ category: 1, status: 1 });
  } catch (e) {
    console.warn('   Note on articles index:', e.message);
  }

  // Pages
  try {
    await db.collection('pages').createIndex({ category: 1, status: 1 });
  } catch (e) {
    console.warn('   Note on pages index:', e.message);
  }

  console.log('   Performance indexes established successfully.');
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
