import express from 'express';
import requireAuth from '../middlewares/auth.middleware.js';
import {
  getDashboardOverview,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getCandidates,
  createCandidate,
  updateCandidateStatus,
  updateCandidate,
  deleteCandidate,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getPlacements,
  createPlacement,
  updatePlacement,
  deletePlacement,
  getCmsPages,
  getCmsPageBySlug,
  createCmsPage,
  updateCmsPage,
  togglePublishCmsPage,
  deleteCmsPage,
  getCmsArticles,
  createCmsArticle,
  updateCmsArticle,
  togglePublishCmsArticle,
  deleteCmsArticle,
  getCmsMedia,
  createCmsMedia,
  deleteCmsMedia,
  getSeoSettings,
  updateSeoSettings,
  getAnnouncements,
  createAnnouncement,
  togglePublishAnnouncement,
  deleteAnnouncement,
  getCmsStats,
  getActivities,
  getCurrentUser,
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply auth middleware to all admin endpoints (Supports X-Demo-Role header: admin, editor, viewer)
router.use(requireAuth());

// Current User & Active Role
router.get('/auth/me', getCurrentUser);

// Dashboard Overview & Charts
router.get('/stats', getDashboardOverview);
router.get('/activities', getActivities);

// Manpower: Employees
router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// Manpower: Candidates
router.get('/candidates', getCandidates);
router.post('/candidates', createCandidate);
router.put('/candidates/:id', updateCandidate);
router.patch('/candidates/:id/status', updateCandidateStatus);
router.delete('/candidates/:id', deleteCandidate);

// Manpower: Clients
router.get('/clients', getClients);
router.post('/clients', createClient);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

// Manpower: Job Requirements
router.get('/jobs', getJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Manpower: Placements
router.get('/placements', getPlacements);
router.post('/placements', createPlacement);
router.put('/placements/:id', updatePlacement);
router.delete('/placements/:id', deletePlacement);

// CMS: Stats & Overview
router.get('/cms/stats', getCmsStats);

// CMS: Pages
router.get('/cms/pages', getCmsPages);
router.get('/cms/pages/:slug', getCmsPageBySlug);
router.post('/cms/pages', createCmsPage);
router.put('/cms/pages/:id', updateCmsPage);
router.patch('/cms/pages/:id/publish', togglePublishCmsPage);
router.delete('/cms/pages/:id', deleteCmsPage);

// CMS: Articles & News
router.get('/cms/articles', getCmsArticles);
router.post('/cms/articles', createCmsArticle);
router.put('/cms/articles/:id', updateCmsArticle);
router.patch('/cms/articles/:id/publish', togglePublishCmsArticle);
router.delete('/cms/articles/:id', deleteCmsArticle);

// CMS: Media Library
router.get('/cms/media', getCmsMedia);
router.post('/cms/media', createCmsMedia);
router.delete('/cms/media/:id', deleteCmsMedia);

// CMS: SEO Settings
router.get('/cms/seo', getSeoSettings);
router.put('/cms/seo', updateSeoSettings);

// CMS: Announcements
router.get('/cms/announcements', getAnnouncements);
router.post('/cms/announcements', createAnnouncement);
router.patch('/cms/announcements/:id/publish', togglePublishAnnouncement);
router.delete('/cms/announcements/:id', deleteAnnouncement);

export default router;
