import { describe, it, expect } from 'vitest';
import Activity from '../../models/activity.mongo.model.js';

describe('Activity Mongo Model Validation', () => {
  it('validates Activity with entityType "Security RBAC" without schema error', () => {
    const activity = new Activity({
      action: 'Admin Logged In',
      entityType: 'Security RBAC',
      entityId: 'superadmin@thinkwires.com',
      description: 'Superadmin logged into administrative portal.',
      user: { name: 'Super Admin', role: 'superadmin' },
      badgeColor: '#10B981',
    });

    const validationError = activity.validateSync();
    expect(validationError).toBeUndefined();
  });

  it('validates Activity with all standard entityTypes', () => {
    const validTypes = [
      'Employee',
      'Candidate',
      'Client',
      'Job',
      'Placement',
      'CMS',
      'Security',
      'Security RBAC',
      'System',
    ];

    validTypes.forEach((type) => {
      const act = new Activity({
        action: 'Test Action',
        entityType: type,
        entityId: '123',
        description: `Testing ${type}`,
      });
      expect(act.validateSync()).toBeUndefined();
    });
  });

  it('rejects unrecognized entityType with Mongoose ValidationError', () => {
    const invalidAct = new Activity({
      action: 'Invalid Action',
      entityType: 'CompletelyBogusType',
      description: 'Testing invalid type',
    });

    const validationError = invalidAct.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.entityType).toBeDefined();
  });
});
