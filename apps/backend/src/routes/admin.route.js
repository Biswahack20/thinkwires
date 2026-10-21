import express from 'express';
import requireAuth, { requireRole } from '../middlewares/auth.middleware.js';
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
  getCmsTechStacks,
  createCmsTechStack,
  updateCmsTechStack,
  toggleCmsTechStackFeatured,
  deleteCmsTechStack,
  getCmsStats,
  getActivities,
  getCurrentUser,
  loginAdmin,
  logoutAdmin,
  getSystemMembers,
  createSystemMember,
  updateSystemMember,
  deleteSystemMember,
} from '../controllers/admin.controller.js';

const router = express.Router();

// ================= PUBLIC AUTHENTICATION ENDPOINTS =================
router.post('/auth/login', loginAdmin);
router.post('/auth/logout', logoutAdmin);

// ================= PROTECTED ADMIN ENDPOINTS =================
// Strictly requires valid Admin JWT session
router.use(requireAuth());

// Current User & Active Role
router.get('/auth/me', getCurrentUser);

// Dashboard Overview & Charts (Manpower and financial metrics)
const superadminGuard = requireRole('superadmin');
const manpowerGuard = requireRole('superadmin', 'admin');
const cmsGuard = requireRole('superadmin', 'cms_admin');

router.get('/stats', manpowerGuard, getDashboardOverview);
router.get('/activities', getActivities);

// ============================================================================
// RBAC MODULE GUARDS:
// 1. System Members: Accessible EXCLUSIVELY to SuperAdmin.
// 2. Manpower & Recruitment: Accessible ONLY to SuperAdmin and Admin.
// 3. Content Management System (CMS): Accessible ONLY to SuperAdmin and CMS Admin.
// ============================================================================

// System Members Management (Superadmin Only)
router.get('/system-members', superadminGuard, getSystemMembers);
router.post('/system-members', superadminGuard, createSystemMember);
router.put('/system-members/:id', superadminGuard, updateSystemMember);
router.delete('/system-members/:id', superadminGuard, deleteSystemMember);

// Manpower: Employees
router.get('/employees', manpowerGuard, getEmployees);
router.post('/employees', manpowerGuard, createEmployee);
router.put('/employees/:id', manpowerGuard, updateEmployee);
router.delete('/employees/:id', manpowerGuard, deleteEmployee);

// Manpower: Candidates
router.get('/candidates', manpowerGuard, getCandidates);
router.post('/candidates', manpowerGuard, createCandidate);
router.put('/candidates/:id', manpowerGuard, updateCandidate);
router.patch('/candidates/:id/status', manpowerGuard, updateCandidateStatus);
router.delete('/candidates/:id', manpowerGuard, deleteCandidate);

// Manpower: Clients
router.get('/clients', manpowerGuard, getClients);
router.post('/clients', manpowerGuard, createClient);
router.put('/clients/:id', manpowerGuard, updateClient);
router.delete('/clients/:id', manpowerGuard, deleteClient);

// Manpower: Job Requirements
router.get('/jobs', manpowerGuard, getJobs);
router.post('/jobs', manpowerGuard, createJob);
router.put('/jobs/:id', manpowerGuard, updateJob);
router.delete('/jobs/:id', manpowerGuard, deleteJob);

// Manpower: Placements
router.get('/placements', manpowerGuard, getPlacements);
router.post('/placements', manpowerGuard, createPlacement);
router.put('/placements/:id', manpowerGuard, updatePlacement);
router.delete('/placements/:id', manpowerGuard, deletePlacement);

// CMS: Stats & Overview
router.get('/cms/stats', cmsGuard, getCmsStats);

// CMS: Pages
router.get('/cms/pages', cmsGuard, getCmsPages);
router.get('/cms/pages/:slug', cmsGuard, getCmsPageBySlug);
router.post('/cms/pages', cmsGuard, createCmsPage);
router.put('/cms/pages/:id', cmsGuard, updateCmsPage);
router.patch('/cms/pages/:id/publish', cmsGuard, togglePublishCmsPage);
router.delete('/cms/pages/:id', cmsGuard, deleteCmsPage);

// CMS: Articles & News
router.get('/cms/articles', cmsGuard, getCmsArticles);
router.post('/cms/articles', cmsGuard, createCmsArticle);
router.put('/cms/articles/:id', cmsGuard, updateCmsArticle);
router.patch('/cms/articles/:id/publish', cmsGuard, togglePublishCmsArticle);
router.delete('/cms/articles/:id', cmsGuard, deleteCmsArticle);

// CMS: Media Library
router.get('/cms/media', cmsGuard, getCmsMedia);
router.post('/cms/media', cmsGuard, createCmsMedia);
router.delete('/cms/media/:id', cmsGuard, deleteCmsMedia);

// CMS: SEO Settings
router.get('/cms/seo', cmsGuard, getSeoSettings);
router.put('/cms/seo', cmsGuard, updateSeoSettings);

// CMS: Announcements
router.get('/cms/announcements', cmsGuard, getAnnouncements);
router.post('/cms/announcements', cmsGuard, createAnnouncement);
router.patch('/cms/announcements/:id/publish', cmsGuard, togglePublishAnnouncement);
router.delete('/cms/announcements/:id', cmsGuard, deleteAnnouncement);

// CMS: Tech Stack Catalog
router.get('/cms/tech-stack', cmsGuard, getCmsTechStacks);
router.post('/cms/tech-stack', cmsGuard, createCmsTechStack);
router.put('/cms/tech-stack/:id', cmsGuard, updateCmsTechStack);
router.patch('/cms/tech-stack/:id/feature', cmsGuard, toggleCmsTechStackFeatured);
router.delete('/cms/tech-stack/:id', cmsGuard, deleteCmsTechStack);

export default router;
