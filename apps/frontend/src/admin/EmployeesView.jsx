import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CloseIcon,
  AlertCircleIcon,
  UsersIcon,
  ShieldIcon,
} from './AdminIcons';

const renderRoleBadge = (role) => {
  switch (role) {
    case 'superadmin':
      return (
        <span
          style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            background: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Superadmin
        </span>
      );
    case 'cms_admin':
      return (
        <span
          style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            background: '#EEF2FF',
            color: '#4F46E5',
            border: '1px solid #C7D2FE',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          CMS Admin
        </span>
      );
    case 'admin':
      return (
        <span
          style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            background: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Admin
        </span>
      );
    default:
      return (
        <span
          style={{
            fontSize: '0.68rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '4px',
            background: '#F8FAFC',
            color: '#475569',
            border: '1px solid #E2E8F0',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          Workforce
        </span>
      );
  }
};

const EmployeesView = () => {
  const { showToast, activeRole } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    role: 'employee',
    portalAccess: false,
    password: '',
    technicalSkills: '',
    experience: 5,
    availability: 'Immediate',
    deploymentStatus: 'Available',
    billingRate: 6000,
    location: 'Remote (India)',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  const fetchEmployees = () => {
    setLoading(true);
    adminApi
      .getEmployees({ search, availability, status, page, limit: 10 })
      .then((res) => {
        let list = res.employees || [];
        if (roleFilter !== 'All') {
          list = list.filter((e) => (e.role || 'employee') === roleFilter);
        }
        setEmployees(list);
        setPagination(res.pagination || { total: list.length, totalPages: 1 });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load employees: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, availability, status, roleFilter, page]);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot add employees (Read-only).');
      return;
    }
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      designation: '',
      role: 'employee',
      portalAccess: false,
      password: '',
      technicalSkills: '',
      experience: 5,
      availability: 'Immediate',
      deploymentStatus: 'Available',
      billingRate: 6000,
      location: 'Remote (India)',
      notes: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (emp) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit records.');
      return;
    }
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      designation: emp.designation || '',
      role: emp.role || 'employee',
      portalAccess: Boolean(
        emp.portalAccess || (emp.role && emp.role !== 'employee')
      ),
      password: '',
      technicalSkills: Array.isArray(emp.technicalSkills)
        ? emp.technicalSkills.join(', ')
        : emp.technicalSkills || '',
      experience: emp.experience || 0,
      availability: emp.availability || 'Immediate',
      deploymentStatus: emp.deploymentStatus || 'Available',
      billingRate: emp.billingRate || 0,
      location: emp.location || 'Remote',
      notes: emp.notes || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.designation.trim()
    ) {
      setFormError('Please enter Full Name, Work Email, and Designation.');
      return;
    }

    if (formData.role !== 'employee' && activeRole !== 'superadmin') {
      setFormError(
        'Access Denied: Only Superadmin can assign portal roles or create System Members.'
      );
      return;
    }

    if (activeRole === 'superadmin' && formData.role !== 'employee') {
      if (
        !editingEmployee &&
        (!formData.password || formData.password.trim().length < 6)
      ) {
        setFormError(
          'Please specify an initial password of at least 6 characters for this system member.'
        );
        return;
      }
      if (
        editingEmployee &&
        formData.password &&
        formData.password.trim().length < 6
      ) {
        setFormError('New password must be at least 6 characters long.');
        return;
      }
    }

    const payload = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
      technicalSkills: formData.technicalSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (!payload.password || payload.password.trim() === '') {
      delete payload.password;
    }

    if (editingEmployee) {
      adminApi
        .updateEmployee(editingEmployee.id || editingEmployee._id, payload)
        .then(() => {
          showToast(`Employee ${formData.name} updated successfully.`);
          setModalOpen(false);
          fetchEmployees();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createEmployee(payload)
        .then(() => {
          showToast(`Employee ${formData.name} added to roster.`);
          setModalOpen(false);
          fetchEmployees();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot delete records.');
      return;
    }
    adminApi
      .deleteEmployee(id)
      .then(() => {
        showToast('Employee deleted from system.');
        setDeleteConfirmId(null);
        fetchEmployees();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      {/* Header */}
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Workforce Directory & Role Management</h1>
          <p className="tw-view-subtitle">
            Manage technical employees and system administrators created by
            Superadmin, including Admin, CMS Admin, and Job Requirement Adders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          {activeRole === 'superadmin' && (
            <Link
              to="/admin/system-members"
              className="tw-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                textDecoration: 'none',
              }}
              title="System Members Portal (Superadmin Only)"
            >
              <ShieldIcon size={15} />
              <span>System Members</span>
            </Link>
          )}
          <button
            className="tw-btn-primary"
            onClick={openAddModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <PlusIcon size={15} />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="tw-table-container">
        {/* Table Filters Toolbar */}
        <div
          className="tw-table-toolbar"
          style={{ flexWrap: 'wrap', gap: '0.65rem' }}
        >
          <div
            className="tw-table-filters"
            style={{ flexWrap: 'wrap', gap: '0.5rem' }}
          >
            <input
              type="text"
              className="tw-filter-input"
              placeholder="Search by name, email, skill, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '250px' }}
            />

            <select
              className="tw-filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All System Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="cms_admin">CMS Admin</option>
              <option value="admin">Admin</option>
              <option value="employee">Workforce</option>
            </select>

            <select
              className="tw-filter-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="All">All Availabilities</option>
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="Employed">Employed</option>
            </select>

            <select
              className="tw-filter-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Deployments</option>
              <option value="Available">Available</option>
              <option value="Deployed">Deployed</option>
              <option value="On Notice">On Notice</option>
              <option value="Bench">Bench</option>
            </select>
          </div>

          <div
            style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: 'auto' }}
          >
            Active Personnel: <strong>{employees.length}</strong>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th style={{ minWidth: '200px' }}>Employee & System Role</th>
                <th style={{ minWidth: '180px' }}>Designation & Exp</th>
                <th style={{ minWidth: '130px' }}>Portal Role</th>
                <th style={{ minWidth: '160px' }}>Technical Skills</th>
                <th style={{ minWidth: '100px' }}>Availability</th>
                <th style={{ minWidth: '110px' }}>Deployment</th>
                <th style={{ minWidth: '120px' }}>Billing Rate</th>
                <th style={{ textAlign: 'right', minWidth: '80px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#64748B',
                    }}
                  >
                    Loading employee directory...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: 'center',
                      padding: '3.5rem 1rem',
                      color: '#64748B',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '0.75rem',
                        color: '#94A3B8',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <UsersIcon size={40} />
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: '#1E293B',
                        marginBottom: '0.35rem',
                        fontSize: '0.95rem',
                      }}
                    >
                      No Employee Records Found
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        color: '#64748B',
                        maxWidth: '420px',
                        margin: '0 auto 1.25rem',
                      }}
                    >
                      All demo fake employees have been cleared. As Superadmin,
                      click below to onboard real employees, portal admins, CMS
                      admins, or recruiters.
                    </div>
                    <button
                      className="tw-btn-primary"
                      onClick={openAddModal}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <PlusIcon size={15} />
                      <span>Onboard First Employee</span>
                    </button>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id || emp._id}>
                    <td data-label="Employee & System Role">
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>
                        {emp.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.73rem',
                          color: '#64748B',
                          marginTop: '0.1rem',
                        }}
                      >
                        {emp.email} {emp.phone ? `• ${emp.phone}` : ''}
                      </div>
                    </td>

                    <td data-label="Designation & Exp">
                      <div style={{ fontWeight: 500 }}>{emp.designation}</div>
                      <div
                        style={{
                          fontSize: '0.73rem',
                          color: '#64748B',
                          marginTop: '0.1rem',
                        }}
                      >
                        {emp.experience} yrs exp • {emp.location || 'Remote'}
                      </div>
                    </td>

                    <td data-label="Portal Role">{renderRoleBadge(emp.role)}</td>

                    <td data-label="Technical Skills">
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.25rem',
                          flexWrap: 'wrap',
                          maxWidth: '240px',
                        }}
                      >
                        {(emp.technicalSkills || [])
                          .slice(0, 3)
                          .map((sk, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                backgroundColor: '#EBF2FC',
                                color: '#3478D4',
                                fontWeight: 500,
                              }}
                            >
                              {sk}
                            </span>
                          ))}
                        {(emp.technicalSkills || []).length > 3 && (
                          <span
                            style={{ fontSize: '0.68rem', color: '#94A3B8' }}
                          >
                            +{(emp.technicalSkills || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td data-label="Availability">
                      <span className="tw-badge available">
                        {emp.availability || 'Immediate'}
                      </span>
                    </td>

                    <td data-label="Deployment">
                      <span
                        className={`tw-badge ${(emp.deploymentStatus || 'Available').toLowerCase().replace(' ', '-')}`}
                      >
                        {emp.deploymentStatus || 'Available'}
                      </span>
                    </td>

                    <td data-label="Billing Rate">
                      <strong>
                        ${Number(emp.billingRate || 0).toLocaleString()}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        /mo
                      </span>
                    </td>

                    <td data-label="Actions" style={{ textAlign: 'right' }}>
                      <div
                        className="tw-action-btn-group"
                        style={{ justifyContent: 'flex-end' }}
                      >
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => openEditModal(emp)}
                          title="Edit Employee"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          className="tw-action-icon-btn delete"
                          onClick={() => setDeleteConfirmId(emp.id || emp._id)}
                          title="Delete Employee"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {employees.length > 0 && (
          <div className="tw-pagination">
            <div>
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="tw-pagination-buttons">
              <button
                className="tw-page-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="tw-page-btn"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '680px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">
                {editingEmployee
                  ? `Edit ${editingEmployee.name}`
                  : 'Onboard New Employee / System Member'}
              </h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setModalOpen(false)}
                title="Close"
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
                      gap: '0.45rem',
                    }}
                  >
                    <AlertCircleIcon size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Row 1: Name and Email */}
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
                      placeholder="e.g. Vikram Sethi"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Work Email *</label>
                    <input
                      type="email"
                      className="tw-form-input"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="vikram@thinkwires.com"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Designation and System / Portal Role */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      Designation / Title *
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
                      placeholder="e.g. Lead Cloud Architect / CMS Lead"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      System / Portal Role *
                    </label>
                    <select
                      className="tw-form-select"
                      value={formData.role}
                      disabled={
                        activeRole !== 'superadmin' &&
                        editingEmployee &&
                        editingEmployee.role !== 'employee'
                      }
                      onChange={(e) => {
                        const r = e.target.value;
                        if (activeRole !== 'superadmin' && r !== 'employee') {
                          showToast(
                            'System Members with portal roles can only be added or edited by Superadmin.'
                          );
                          return;
                        }
                        setFormData({
                          ...formData,
                          role: r,
                          portalAccess: r !== 'employee',
                        });
                      }}
                    >
                      <option value="employee">
                        Workforce Engineer (No Portal Admin Access)
                      </option>
                      {activeRole === 'superadmin' ? (
                        <>
                          <option value="superadmin">
                            Superadmin (Full Control Across All Modules)
                          </option>
                          <option value="admin">
                            Admin (General System & Workforce)
                          </option>
                          <option value="cms_admin">
                            CMS Admin (Content Management System Only)
                          </option>
                        </>
                      ) : (
                        formData.role !== 'employee' && (
                          <option value={formData.role} disabled>
                            {formData.role.toUpperCase()} (Superadmin Authority
                            Required)
                          </option>
                        )
                      )}
                    </select>
                    {activeRole !== 'superadmin' && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: '#64748B',
                          marginTop: '0.25rem',
                          display: 'block',
                        }}
                      >
                        Portal roles (Admin, CMS Admin, Superadmin) can only be
                        added and edited by Superadmin.
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional Portal Password for Superadmin */}
                {activeRole === 'superadmin' &&
                  formData.role !== 'employee' && (
                    <div
                      className="tw-form-group"
                      style={{
                        backgroundColor: '#F8FAFC',
                        padding: '0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        marginBottom: '1rem',
                      }}
                    >
                      <label
                        className="tw-form-label"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>
                          Portal Password{' '}
                          {editingEmployee
                            ? '(Leave blank to retain current)'
                            : '*'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#059669',
                            fontWeight: 600,
                          }}
                        >
                          Superadmin Provisioning
                        </span>
                      </label>
                      <input
                        type="password"
                        className="tw-form-input"
                        value={formData.password || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder={
                          editingEmployee
                            ? 'Leave empty to keep existing password'
                            : 'Enter portal access password (min 6 chars)'
                        }
                        minLength={editingEmployee ? 0 : 6}
                        required={!editingEmployee}
                      />
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#64748B',
                          marginTop: '0.25rem',
                          display: 'block',
                        }}
                      >
                        Password configured here will be assigned to this
                        member's system login account.
                      </span>
                    </div>
                  )}

                {/* Row 3: Phone and Location */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Phone Number</label>
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
                    <label className="tw-form-label">Work Location</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Bangalore, India / Remote"
                    />
                  </div>
                </div>

                {/* Row 4: Technical Skills */}
                <div className="tw-form-group">
                  <label className="tw-form-label">
                    Technical Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.technicalSkills}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technicalSkills: e.target.value,
                      })
                    }
                    placeholder="React, TypeScript, AWS, Docker, Kubernetes"
                  />
                </div>

                {/* Row 5: Experience & Billing Rate */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Experience (Years)</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experience: Number(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      Monthly Billing Rate ($)
                    </label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.billingRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billingRate: Number(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                </div>

                {/* Row 6: Availability & Deployment Status */}
                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Availability</label>
                    <select
                      className="tw-form-select"
                      value={formData.availability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: e.target.value,
                        })
                      }
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="Employed">Employed</option>
                    </select>
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Deployment Status</label>
                    <select
                      className="tw-form-select"
                      value={formData.deploymentStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          deploymentStatus: e.target.value,
                        })
                      }
                    >
                      <option value="Available">Available</option>
                      <option value="Deployed">Deployed</option>
                      <option value="On Notice">On Notice</option>
                      <option value="Bench">Bench</option>
                    </select>
                  </div>
                </div>

                {/* Row 7: Notes */}
                <div className="tw-form-group">
                  <label className="tw-form-label">
                    Deployment / Access Notes
                  </label>
                  <textarea
                    className="tw-form-textarea"
                    rows="2"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Candidate background, security clearances, client fit details, portal access justification..."
                  ></textarea>
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
                  {editingEmployee ? 'Save Changes' : 'Onboard Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '440px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Confirm Deletion</h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setDeleteConfirmId(null)}
                title="Close"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to permanently remove this employee from the
              directory? Any linked portal account will also be deactivated.
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
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesView;
