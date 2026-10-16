import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const JobsView = () => {
  const { showToast, activeRole } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    requiredSkills: '',
    experienceRequired: 5,
    openingsCount: 1,
    location: 'Remote (India/US)',
    workMode: 'Remote',
    priority: 'Medium',
    status: 'Open',
    budget: '₹28-35 LPA ($45-55k)',
  });

  const [formError, setFormError] = useState('');

  const fetchJobs = () => {
    setLoading(true);
    adminApi
      .getJobs({ search, priority: priorityFilter, status: statusFilter })
      .then((res) => {
        setJobs(res.jobs || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load jobs: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchJobs();
    adminApi.getClients().then((res) => setClients(res.clients || []));
  }, [search, priorityFilter, statusFilter]);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot post requisitions.');
      return;
    }
    setEditingJob(null);
    setFormData({
      title: '',
      client: clients[0]?.companyName || 'FinTech Nexus Corp',
      requiredSkills: '',
      experienceRequired: 5,
      openingsCount: 1,
      location: 'Remote (India/US)',
      workMode: 'Remote',
      priority: 'High',
      status: 'Open',
      budget: '₹28-35 LPA ($45-55k)',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit requisitions.');
      return;
    }
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      client: job.client || '',
      requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills.join(', ') : job.requiredSkills || '',
      experienceRequired: job.experienceRequired || 3,
      openingsCount: job.openingsCount || 1,
      location: job.location || 'Remote',
      workMode: job.workMode || 'Remote',
      priority: job.priority || 'Medium',
      status: job.status || 'Open',
      budget: job.budget || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.client.trim()) {
      setFormError('Please enter Requisition Title and Client Name.');
      return;
    }

    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingJob) {
      adminApi
        .updateJob(editingJob.id || editingJob._id, payload)
        .then(() => {
          showToast(`Requisition '${formData.title}' updated.`);
          setModalOpen(false);
          fetchJobs();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createJob(payload)
        .then(() => {
          showToast(`Requisition '${formData.title}' posted.`);
          setModalOpen(false);
          fetchJobs();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot close requisitions.');
      return;
    }
    adminApi
      .deleteJob(id)
      .then(() => {
        showToast('Requisition removed.');
        setDeleteConfirmId(null);
        fetchJobs();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Staffing Requisitions & Job Requirements</h1>
          <p className="tw-view-subtitle">
            Manage client job orders, priority allocations, required technical skill sets, and headcount fulfillment.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          ➕ Post Requisition
        </button>
      </div>

      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <div className="tw-table-filters">
            <input
              type="text"
              className="tw-filter-input"
              placeholder="Filter by title, client, skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '240px' }}
            />

            <select
              className="tw-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              className="tw-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Active orders: <strong>{jobs.length}</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Job Requisition</th>
                <th>Client Partner</th>
                <th>Target Skills</th>
                <th>Openings</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Budget / CTC</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    Loading requisitions...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No job requirements found matching your criteria.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id || job._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B' }}>
                        {job.workMode} • {job.location} • {job.experienceRequired}+ yrs
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{job.client}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', maxWidth: '200px' }}>
                        {(job.requiredSkills || []).map((sk, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '4px',
                              backgroundColor: '#EBF2FC',
                              color: '#3478D4',
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong>
                        {job.fulfilledCount || 0} / {job.openingsCount}
                      </strong>
                    </td>
                    <td>
                      <span className={`tw-badge ${job.priority.toLowerCase()}`}>{job.priority}</span>
                    </td>
                    <td>
                      <span className={`tw-badge ${job.status.toLowerCase().replace(' ', '-')}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{job.budget}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="tw-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => openEditModal(job)}
                          title="Edit Requisition"
                        >
                          ✏️
                        </button>
                        <button
                          className="tw-action-icon-btn delete"
                          onClick={() => setDeleteConfirmId(job.id || job._id)}
                          title="Close Requisition"
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
      </div>

      {/* Add / Edit Job Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal">
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">
                {editingJob ? `Edit ${editingJob.title}` : 'Post New Staffing Requirement'}
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
                    <label className="tw-form-label">Job Title *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Lead Full Stack & Frontend Engineer"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Corporate Client *</label>
                    <select
                      className="tw-form-select"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    >
                      {clients.map((c) => (
                        <option key={c.id || c._id} value={c.companyName}>
                          {c.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Required Technical Skills (comma separated) *</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.requiredSkills}
                    onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                    placeholder="React, TypeScript, Next.js, Redux"
                  />
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Experience Required (Years)</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.experienceRequired}
                      onChange={(e) => setFormData({ ...formData, experienceRequired: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Open Headcount Positions</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.openingsCount}
                      onChange={(e) => setFormData({ ...formData, openingsCount: Number(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Priority</label>
                    <select
                      className="tw-form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Urgent">Urgent (48-hour SLA)</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Status</label>
                    <select
                      className="tw-form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Fulfilled">Fulfilled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Location / Work Mode</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Remote (India/US) / Hybrid"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Budget / Compensation Band</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="₹28-35 LPA ($45-55k)"
                    />
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
                  {editingJob ? 'Save Requisition' : 'Publish Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '440px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Close Requisition</h2>
              <button className="tw-modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to close and archive this staffing requirement?
            </div>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsView;
