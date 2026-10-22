import request from 'supertest';
import app from '../app.js';
import {
  generateCandidateToken,
  generateAdminToken,
  generateCsrfToken,
} from '../utils/auth.util.js';

/**
 * Supertest client initialized with Express app
 */
export const api = request(app);

/**
 * Generates an authenticated candidate session cookie for tests
 */
export function getCandidateAuthCookie(
  candidate = {
    id: 'test-cand-001',
    email: 'candidate@thinkwires.com',
    name: 'Test Candidate',
  }
) {
  const token = generateCandidateToken(candidate);
  return `thinkwires_candidate_jwt=${token}`;
}

/**
 * Generates an authenticated admin session cookie for tests
 */
export function getAdminAuthCookie(
  admin = {
    id: 'test-admin-001',
    email: 'admin@thinkwires.com',
    name: 'Test Admin',
    role: 'admin',
  }
) {
  const token = generateAdminToken(admin);
  return `thinkwires_admin_jwt=${token}`;
}

/**
 * Generates matching CSRF cookie and header values for authenticated state-changing tests
 */
export function getAdminCsrfPair() {
  const token = generateCsrfToken();
  return {
    cookie: `tw_admin_csrf=${token}`,
    token,
  };
}
