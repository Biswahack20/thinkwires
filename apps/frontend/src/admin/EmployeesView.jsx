import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const EmployeesView = () => {
  const { showToast, activeRole } = useOutletContext();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
      .getEmployees({ search, availability, status, page, limit: 8 })
      .then((res) => {
        setEmployees(res.employees || []);
        setPagination(res.pagination || { total: 0, totalPages: 1 });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load employees: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, availability, status, page]);

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
      technicalSkills: Array.isArray(emp.technicalSkills) ? emp.technicalSkills.join(', ') : emp.technicalSkills || '',
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.designation.trim()) {
      setFormError('Please enter Name, Email, and Designation.');
      return;
    }

    const payload = {
      ...formData,
      technicalSkills: formData.technicalSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

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
          <h1>Technical Workforce Directory</h1>
          <p className="tw-view-subtitle">
            Manage full-time engineering employees, deployment statuses, billable rates, and skill sets.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          ➕ Add Employee
        </button>
      </div>

      {/* Table Container */}
      <div className="tw-table-container">
        {/* Toolbar */}
        <div className="tw-table-toolbar">
          <div className="tw-table-filters">
            <input
              type="text"
              className="tw-filter-input"
              placeholder="Filter by name, skill, or role..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ width: '240px' }}
            />

            <select
              className="tw-filter-select"
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Availability</option>
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="Employed">Employed</option>
            </select>

            <select
              className="tw-filter-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All Deployment Statuses</option>
              <option value="Available">Available</option>
              <option value="Deployed">Deployed</option>
              <option value="On Notice">On Notice</option>
              <option value="Bench">Bench</option>
            </select>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing <strong>{employees.length}</strong> of {pagination.total} records
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Designation & Exp</th>
                <th>Technical Skills</th>
                <th>Availability</th>
                <th>Deployment</th>
                <th>Rate</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    Loading employee directory...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No employees matched your search filters.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id || emp._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{emp.name}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B' }}>{emp.email}</div>
                    </td>
                    <td>
                      <div>{emp.designation}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B' }}>
                        {emp.experience} yrs exp • {emp.location}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', maxWidth: '240px' }}>
                        {(emp.technicalSkills || []).slice(0, 3).map((sk, idx) => (
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
                          <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                            +{(emp.technicalSkills || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="tw-badge available">{emp.availability}</span>
                    </td>
                    <td>
                      <span className={`tw-badge ${emp.deploymentStatus.toLowerCase().replace(' ', '-')}`}>
                        {emp.deploymentStatus}
                      </span>
                    </td>
                    <td>
                      <strong>${Number(emp.billingRate || 0).toLocaleString()}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>/mo</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="tw-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => openEditModal(emp)}
                          title="Edit Employee"
                        >
                          ✏️
                        </button>
                        <button
                          className="tw-action-icon-btn delete"
                          onClick={() => setDeleteConfirmId(emp.id || emp._id)}
                          title="Delete Employee"
                        >
                          🗑️
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
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal">
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">
                {editingEmployee ? `Edit ${editingEmployee.name}` : 'Onboard New Employee'}
              </h2>
              <button className="tw-modal-close-btn" onClick={() => setModalOpen(false)}>
                ✕
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
                    }}
                  >
                    ⚠️ {formError}
                  </div>
                )}

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Full Name *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram@thinkwires.com"
                      required
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Designation / Title *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="e.g. Lead Cloud Architect"
                      required
                    />
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Technical Skills (comma separated) *</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.technicalSkills}
                    onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
                    placeholder="React, TypeScript, AWS, Docker, Kubernetes"
                  />
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Experience (Years)</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Monthly Billing Rate ($)</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.billingRate}
                      onChange={(e) => setFormData({ ...formData, billingRate: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Availability</label>
                    <select
                      className="tw-form-select"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, deploymentStatus: e.target.value })}
                    >
                      <option value="Available">Available</option>
                      <option value="Deployed">Deployed</option>
                      <option value="On Notice">On Notice</option>
                      <option value="Bench">Bench</option>
                    </select>
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Deployment Notes</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Candidate background, security clearances, client fit details..."
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
                  {editingEmployee ? 'Save Changes' : 'Add to Roster'}
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
              <button className="tw-modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to permanently remove this employee from the directory? This action will also update active deployment associations.
            </div>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
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
