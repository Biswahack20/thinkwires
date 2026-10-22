import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CloseIcon,
  AlertCircleIcon,
  ShieldIcon,
  LockIcon,
  KeyIcon,
  SearchIcon,
  EyeIcon,
  CheckIcon,
} from './AdminIcons';

const ROLE_SCOPES = {
  superadmin: {
    label: 'Superadmin',
    badgeClass: 'superadmin',
    color: '#047857',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    description:
      'Complete unrestricted control across Overview, Manpower, Candidates, Clients, CMS, and System Members.',
  },
  admin: {
    label: 'Admin',
    badgeClass: 'admin',
    color: '#1D4ED8',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    description:
      'Operational control over Manpower, Employees, Candidates, Clients, Job Requisitions, and Placements.',
  },
  cms_admin: {
    label: 'CMS Admin',
    badgeClass: 'cms_admin',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    description:
      'Dedicated authority over Website Pages, Blog & Thought Leadership, Media Assets, Announcements, and Tech Stack.',
  },
};

const SystemMembersView = () => {
  const { showToast, activeRole } = useOutletContext();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    designation: '',
    phone: '',
    password: '',
    isActive: true,
  });
  const [formError, setFormError] = useState('');

  const isSuperAdmin = activeRole === 'superadmin';

  const fetchMembers = () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminApi
      .getSystemMembers()
      .then((res) => {
        setMembers(res.members || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load system members: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, [activeRole]);

  const openAddModal = () => {
    if (!isSuperAdmin) {
      showToast(
        'Security Alert: Only Superadmin can provision System Members.'
      );
      return;
    }
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      designation: '',
      phone: '',
      password: '',
      isActive: true,
    });
    setShowPassword(false);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    if (!isSuperAdmin) {
      showToast('Security Alert: Only Superadmin can edit System Members.');
      return;
    }
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      role: member.role || 'admin',
      designation: member.designation || '',
      phone: member.phone || '',
      password: '', // blank by default on edit; if entered, updates password
      isActive: member.isActive !== false,
    });
    setShowPassword(false);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please enter Full Name and Official System Email.');
      return;
    }

    if (
      !editingMember &&
      (!formData.password || formData.password.trim().length < 6)
    ) {
      setFormError(
        'Please provide an initial password of at least 6 characters for this member.'
      );
      return;
    }

    if (
      editingMember &&
      formData.password &&
      formData.password.trim().length < 6
    ) {
      setFormError('New password must be at least 6 characters long.');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.toLowerCase().trim(),
      role: formData.role,
      designation: formData.designation.trim() || 'System Member',
      phone: formData.phone.trim(),
      isActive: formData.isActive,
    };

    if (formData.password && formData.password.trim().length >= 6) {
      payload.password = formData.password.trim();
    }

    if (editingMember) {
      adminApi
        .updateSystemMember(
          editingMember._id || editingMember.id || editingMember.email,
          payload
        )
        .then(() => {
          showToast(`System member credentials updated for ${formData.name}.`);
          setModalOpen(false);
          fetchMembers();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createSystemMember(payload)
        .then(() => {
          showToast(
            `System member ${formData.name} provisioned with role ${formData.role.toUpperCase()}.`
          );
          setModalOpen(false);
          fetchMembers();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleDelete = (id) => {
    adminApi
      .deleteSystemMember(id)
      .then(() => {
        showToast('System member portal access revoked.');
        setDeleteConfirmId(null);
        fetchMembers();
      })
      .catch((err) => showToast(`Revocation failed: ${err.message}`));
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    let matches = true;
    if (search) {
      const q = search.toLowerCase();
      matches =
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.designation?.toLowerCase().includes(q);
    }
    if (matches && roleFilter !== 'All') {
      matches = m.role === roleFilter;
    }
    return matches;
  });

  // Access check fallback UI for non-superadmins
  if (!isSuperAdmin) {
    return (
      <div
        style={{ padding: '2rem 1rem', maxWidth: '720px', margin: '0 auto' }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <ShieldIcon size={28} />
          </div>
          <h2
            style={{
              fontSize: '1.35rem',
              color: '#0F172A',
              marginBottom: '0.75rem',
              fontWeight: 700,
            }}
          >
            Superadmin Privileges Required
          </h2>
          <p
            style={{
              color: '#475569',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0 auto 1.5rem',
            }}
          >
            System Member accounts, official emails, role assignments, and
            authentication passwords can only be added and edited by the{' '}
            <strong>Superadmin</strong>.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#F1F5F9',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#64748B',
            }}
          >
            <span>Your Active Role:</span>
            <strong style={{ color: '#0F172A', textTransform: 'uppercase' }}>
              {activeRole}
            </strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>System Members &amp; Access Control</h1>
          <p className="tw-view-subtitle">
            Superadmin exclusive directory. Provision secure corporate accounts,
            assign modular RBAC privileges, and manage access credentials.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          <PlusIcon size={15} />
          <span>Provision System Member</span>
        </button>
      </div>

      {/* Security Privilege Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.25rem',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
          color: '#065F46',
        }}
      >
        <ShieldIcon size={18} color="#047857" />
        <div>
          <strong>Superadmin Exclusive Authority:</strong> Only you have
          authority to create new corporate mail accounts, assign administrative
          roles, and reset member passwords.
        </div>
      </div>

      {/* Role Distribution Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}
          >
            TOTAL SYSTEM USERS
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#0F172A',
              marginTop: '0.25rem',
            }}
          >
            {members.length}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#10B981',
              marginTop: '0.25rem',
            }}
          >
            Active portal credentials
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}
          >
            SUPERADMINS
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#047857',
              marginTop: '0.25rem',
            }}
          >
            {members.filter((m) => m.role === 'superadmin').length}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#64748B',
              marginTop: '0.25rem',
            }}
          >
            Unrestricted root power
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600 }}
          >
            CMS ADMINISTRATORS
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#4F46E5',
              marginTop: '0.25rem',
            }}
          >
            {members.filter((m) => m.role === 'cms_admin').length}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#64748B',
              marginTop: '0.25rem',
            }}
          >
            Content management only
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 600 }}
          >
            MANPOWER &amp; STAFFING
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#1D4ED8',
              marginTop: '0.25rem',
            }}
          >
            {members.filter((m) => m.role === 'admin').length}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: '#64748B',
              marginTop: '0.25rem',
            }}
          >
            Workforce operations
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <div className="tw-table-filters">
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                className="tw-filter-input"
                placeholder="Search member name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.1rem' }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  color: '#94A3B8',
                }}
              >
                <SearchIcon size={14} />
              </span>
            </div>

            <select
              className="tw-filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="cms_admin">CMS Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing <strong>{filteredMembers.length}</strong> system accounts
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>System Member</th>
                <th>Assigned Email (Mail)</th>
                <th>System Role</th>
                <th>Permissions Scope</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '2.5rem',
                      color: '#64748B',
                    }}
                  >
                    Loading system member directory...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '2.5rem',
                      color: '#64748B',
                    }}
                  >
                    No system members matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((mem) => {
                  const scope = ROLE_SCOPES[mem.role] || ROLE_SCOPES.admin;
                  const initials = mem.name
                    ? mem.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'SM';

                  return (
                    <tr key={mem._id || mem.id || mem.email}>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                        >
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: scope.bgColor,
                              color: scope.color,
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${scope.borderColor}`,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <strong
                              style={{
                                color: '#0F172A',
                                fontSize: '0.86rem',
                                display: 'block',
                              }}
                            >
                              {mem.name}
                            </strong>
                            <span
                              style={{ fontSize: '0.74rem', color: '#64748B' }}
                            >
                              {mem.designation || 'Corporate Member'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            color: '#008F68',
                            fontWeight: 600,
                          }}
                        >
                          {mem.email}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            backgroundColor: scope.bgColor,
                            color: scope.color,
                            border: `1px solid ${scope.borderColor}`,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <ShieldIcon size={12} color={scope.color} />
                          <span>{scope.label}</span>
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            color: '#475569',
                            maxWidth: '280px',
                            display: 'block',
                          }}
                        >
                          {scope.description}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`tw-badge ${mem.isActive !== false ? 'available' : 'closed'}`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {mem.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div
                          className="tw-action-btn-group"
                          style={{ justifyContent: 'flex-end' }}
                        >
                          <button
                            className="tw-action-icon-btn"
                            onClick={() => openEditModal(mem)}
                            title="Edit Role, Email or Password"
                          >
                            <EditIcon size={14} />
                          </button>

                          {mem.email !== 'superadmin@thinkwires.com' && (
                            <button
                              className="tw-action-icon-btn delete"
                              onClick={() =>
                                setDeleteConfirmId(
                                  mem._id || mem.id || mem.email
                                )
                              }
                              title="Revoke Credentials"
                            >
                              <TrashIcon size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit System Member Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '580px' }}>
            <div className="tw-modal-header">
              <div>
                <h2 className="tw-modal-title" style={{ margin: 0 }}>
                  {editingMember
                    ? `Edit Credentials: ${editingMember.name}`
                    : 'Provision New System Member'}
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Superadmin Credential Provisioning Engine
                </span>
              </div>
              <button
                className="tw-modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="tw-modal-body">
                {formError && (
                  <div
                    style={{
                      padding: '0.65rem 0.9rem',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertCircleIcon size={16} color="#DC2626" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name & Mail */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Full Name *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Elena Rostova"
                      required
                    />
                  </div>

                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      Official System Email (Mail) *
                    </label>
                    <input
                      type="email"
                      className="tw-form-input"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="elena.cms@thinkwires.com"
                      required
                    />
                  </div>
                </div>

                {/* Designation & Role */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      Designation / Corporate Title *
                    </label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      placeholder="e.g. Chief Content Officer"
                      required
                    />
                  </div>

                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      System Role &amp; Privileges *
                    </label>
                    <select
                      className="tw-form-select"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="superadmin">
                        Superadmin (Complete Full Platform Control)
                      </option>
                      <option value="admin">
                        Admin (Manpower &amp; Staffing Operations)
                      </option>
                      <option value="cms_admin">
                        CMS Admin (Content Management System Only)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Role Scope Preview Banner */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor:
                      ROLE_SCOPES[formData.role]?.bgColor || '#F8FAFC',
                    border: `1px solid ${ROLE_SCOPES[formData.role]?.borderColor || '#E2E8F0'}`,
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.78rem',
                    color: ROLE_SCOPES[formData.role]?.color || '#475569',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldIcon
                    size={16}
                    color={ROLE_SCOPES[formData.role]?.color}
                    style={{ marginTop: '2px', flexShrink: 0 }}
                  />
                  <div>
                    <strong>Assigned Permission Scope:</strong>{' '}
                    <span>{ROLE_SCOPES[formData.role]?.description}</span>
                  </div>
                </div>

                {/* Password Setting */}
                <div className="tw-form-group">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <label className="tw-form-label" style={{ margin: 0 }}>
                      {editingMember
                        ? 'Update / Reset Password'
                        : 'Initial Password *'}
                    </label>
                    {editingMember && (
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        (Leave blank to keep current password)
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="tw-form-input"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={
                        editingMember
                          ? 'Enter new password to change...'
                          : 'Minimum 6 characters (e.g. Pass@123)'
                      }
                      required={!editingMember}
                      minLength={6}
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon size={16} />
                    </button>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748B',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}
                  >
                    Configured by Superadmin. The member will use this password
                    alongside their official email to sign in.
                  </span>
                </div>

                {/* Phone & Status */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      Account Login Status
                    </label>
                    <select
                      className="tw-form-select"
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.value === 'true',
                        })
                      }
                    >
                      <option value="true">
                        Active (Permitted to Sign In)
                      </option>
                      <option value="false">Suspended (Access Revoked)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="tw-modal-footer">
                <button
                  type="button"
                  className="tw-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tw-btn-primary">
                  {editingMember ? 'Save Credentials' : 'Provision Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Revoke Confirmation Modal */}
      {deleteConfirmId && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '440px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Revoke System Access</h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to revoke platform credentials for this
              system member? They will immediately lose access to all modules
              and administrative routes.
            </div>
            <div className="tw-modal-footer">
              <button
                className="tw-btn-secondary"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="tw-btn-danger"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMembersView;
