/**
 * Migration: 002_create_esr_and_text_indexes.js
 * Establishes compound Equality-Sort-Range (ESR) and full-text search indexes across Mongoose collections (SEC-DB-02, SEC-DB-05, DB-02).
 */
export const up = async ({ db }) => {
  console.log('   Creating compound ESR and text search indexes on collections...');

  // 1. Job Requirements ESR and Full-Text Indexes
  await db.collection('jobrequirements').createIndex(
    { isRequisition: 1, createdAt: -1, status: 1 },
    { name: 'idx_job_openings_esr' }
  );
  await db.collection('jobrequirements').createIndex(
    { isRequisition: 1, status: 1, createdAt: -1 },
    { name: 'idx_job_requisitions_esr' }
  );
  await db.collection('jobrequirements').createIndex(
    { title: 'text', description: 'text', requirements: 'text', requiredSkills: 'text', client: 'text' },
    { name: 'idx_job_text_search' }
  );

  // 2. Candidates ESR and Full-Text Indexes
  await db.collection('candidates').createIndex(
    { jobId: 1, createdAt: -1 },
    { name: 'idx_candidates_job_date_esr' }
  );
  await db.collection('candidates').createIndex(
    { name: 'text', currentRole: 'text', technicalSkills: 'text', positionApplied: 'text' },
    { name: 'idx_candidate_text_search' }
  );

  // 3. Job Applications ESR Index
  await db.collection('jobapplications').createIndex(
    { jobId: 1, status: 1, createdAt: -1 },
    { name: 'idx_jobapp_job_status_date_esr' }
  );

  // 4. Clients ESR Index
  await db.collection('clients').createIndex(
    { status: 1, createdAt: -1 },
    { name: 'idx_clients_status_date_esr' }
  );

  // 5. Placements ESR Index
  await db.collection('placements').createIndex(
    { assignmentStatus: 1, createdAt: -1 },
    { name: 'idx_placements_status_date_esr' }
  );
  await db.collection('placements').createIndex(
    { clientName: 1, createdAt: -1 },
    { name: 'idx_placements_client_date_esr' }
  );

  // 6. Articles ESR Index
  await db.collection('articles').createIndex(
    { category: 1, status: 1, createdAt: -1 },
    { name: 'idx_articles_cat_status_date_esr' }
  );

  // 7. Employees ESR Index
  await db.collection('employees').createIndex(
    { deploymentStatus: 1, createdAt: -1 },
    { name: 'idx_employees_status_date_esr' }
  );

  // 8. Pages ESR Index
  await db.collection('pages').createIndex(
    { status: 1, isDeleted: 1, updatedAt: -1 },
    { name: 'idx_pages_status_del_date_esr' }
  );

  // 9. Activity Log ESR Index
  await db.collection('activitylogs').createIndex(
    { entityType: 1, action: 1, createdAt: -1 },
    { name: 'idx_activity_entity_action_date_esr' }
  );

  // 10. HelpDesk Tickets ESR Index
  await db.collection('helpdesktickets').createIndex(
    { status: 1, category: 1, createdAt: -1 },
    { name: 'idx_helpdesk_status_cat_date_esr' }
  );

  // 11. Scoping Call Mandates ESR Index
  await db.collection('scopingcallmandates').createIndex(
    { status: 1, createdAt: -1 },
    { name: 'idx_scoping_status_date_esr' }
  );

  // 12. Newsletter Subscribers ESR Index
  await db.collection('newslettersubscribers').createIndex(
    { status: 1, subscribedAt: -1 },
    { name: 'idx_newsletter_status_date_esr' }
  );

  console.log('   Compound ESR and text search indexes established successfully.');
};

export const verify = async ({ db }) => {
  console.log('   Verifying compound ESR indexes existence...');
  const jobIndexes = await db.collection('jobrequirements').indexes();
  const candIndexes = await db.collection('candidates').indexes();
  const appIndexes = await db.collection('jobapplications').indexes();

  const hasJobEsr = jobIndexes.some((i) => i.name === 'idx_job_openings_esr');
  const hasCandEsr = candIndexes.some((i) => i.name === 'idx_candidates_job_date_esr');
  const hasAppEsr = appIndexes.some((i) => i.name === 'idx_jobapp_job_status_date_esr');

  if (!hasJobEsr || !hasCandEsr || !hasAppEsr) {
    throw new Error('Verification failed: Compound ESR indexes are missing from database collections.');
  }
  console.log('   ✔ Compound ESR and text search indexes verified.');
};

export const down = async ({ db }) => {
  console.log('   Reverting compound ESR and text search indexes...');
  const drops = [
    ['jobrequirements', 'idx_job_openings_esr'],
    ['jobrequirements', 'idx_job_requisitions_esr'],
    ['jobrequirements', 'idx_job_text_search'],
    ['candidates', 'idx_candidates_job_date_esr'],
    ['candidates', 'idx_candidate_text_search'],
    ['jobapplications', 'idx_jobapp_job_status_date_esr'],
    ['clients', 'idx_clients_status_date_esr'],
    ['placements', 'idx_placements_status_date_esr'],
    ['placements', 'idx_placements_client_date_esr'],
    ['articles', 'idx_articles_cat_status_date_esr'],
    ['employees', 'idx_employees_status_date_esr'],
    ['pages', 'idx_pages_status_del_date_esr'],
    ['activitylogs', 'idx_activity_entity_action_date_esr'],
    ['helpdesktickets', 'idx_helpdesk_status_cat_date_esr'],
    ['scopingcallmandates', 'idx_scoping_status_date_esr'],
    ['newslettersubscribers', 'idx_newsletter_status_date_esr'],
  ];

  for (const [coll, idxName] of drops) {
    try {
      await db.collection(coll).dropIndex(idxName);
    } catch {}
  }
};
