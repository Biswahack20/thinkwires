import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const PlacementsView = () => {
  const { showToast, activeRole } = useOutletContext();
  const [placements, setPlacements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    candidateOrEmployeeName: '',
    personType: 'Employee',
    clientName: '',
    jobTitle: '',
    deploymentDate: new Date().toISOString().split('T')[0],
    billingRate: 7500,
    durationMonths: 6,
    assignmentStatus: 'Active',
    notes: '',
  });

  const [formError, setFormError] = useState('');

  const fetchPlacements = () => {
    setLoading(true);
    adminApi
      .getPlacements()
      .then((res) => {
        setPlacements(res.placements || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load placements: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchPlacements();
    adminApi.getEmployees().then((res) => setEmployees(res.employees || []));
    adminApi.getClients().then((res) => setClients(res.clients || []));
  }, []);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot deploy talent.');
      return;
    }
    const firstEmp = employees[0]?.name || 'Arjun Sharma';
    const firstCli = clients[0]?.companyName || 'FinTech Nexus Corp';
    setFormData({
      candidateOrEmployeeName: firstEmp,
      personType: 'Employee',
      clientName: firstCli,
      jobTitle: 'Principal Cloud Infrastructure Architect',
      deploymentDate: new Date().toISOString().split('T')[0],
      billingRate: 8000,
      durationMonths: 6,
      assignmentStatus: 'Active',
      notes: 'Initial SOW signoff completed.',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.candidateOrEmployeeName || !formData.clientName || !formData.jobTitle) {
      setFormError('Talent name, client name, and role title are required.');
      return;
    }

    adminApi
      .createPlacement(formData)
      .then(() => {
        showToast(`Deployment created for ${formData.candidateOrEmployeeName} at ${formData.clientName}.`);
        setModalOpen(false);
        fetchPlacements();
      })
      .catch((err) => setFormError(err.message));
  };

  const handleStatusChange = (id, newStatus) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot change deployment status.');
      return;
    }
    adminApi
      .updatePlacement(id, { assignmentStatus: newStatus })
      .then(() => {
        showToast(`Deployment marked as ${newStatus}`);
        fetchPlacements();
      })
      .catch((err) => showToast(`Update failed: ${err.message}`));
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot terminate placements.');
      return;
    }
    adminApi
      .deletePlacement(id)
      .then(() => {
        showToast('Deployment terminated.');
        setDeleteConfirmId(null);
        fetchPlacements();
      })
      .catch((err) => showToast(`Action failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Active Placements & Billable Deployments</h1>
          <p className="tw-view-subtitle">
            Deploy engineering specialists to corporate client engagements, track statutory deployment dates, and monitor billing margins.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          ➕ Deploy Talent to Client
        </button>
      </div>

      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <h2 className="tw-card-title">Live Engagements ({placements.length})</h2>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Combined Active Billing: <strong>${placements.filter(p => p.assignmentStatus === 'Active').reduce((sum, p) => sum + (Number(p.billingRate) || 0), 0).toLocaleString()}</strong>/month
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Talent Specialist</th>
                <th>Client Partner</th>
                <th>Assigned Role</th>
                <th>Deployment Date</th>
                <th>Contract Term</th>
                <th>Monthly Rate</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    Loading active placements...
                  </td>
                </tr>
              ) : placements.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No deployments recorded yet.
                  </td>
                </tr>
              ) : (
                placements.map((plc) => (
                  <tr key={plc.id || plc._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{plc.candidateOrEmployeeName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Type: {plc.personType}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{plc.clientName}</div>
                    </td>
                    <td>{plc.jobTitle}</td>
                    <td>{new Date(plc.deploymentDate).toLocaleDateString()}</td>
                    <td>{plc.durationMonths} Months</td>
                    <td>
                      <strong>${Number(plc.billingRate).toLocaleString()}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>/mo</span>
                    </td>
                    <td>
                      <select
                        value={plc.assignmentStatus}
                        onChange={(e) => handleStatusChange(plc.id || plc._id, e.target.value)}
                        className="tw-filter-select"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                      >
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Extended">Extended</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="tw-action-icon-btn delete"
                        onClick={() => setDeleteConfirmId(plc.id || plc._id)}
                        title="End Deployment"
                        style={{ marginLeft: 'auto' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Placement Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal">
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Deploy Talent to Client Requisition</h2>
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
                    <label className="tw-form-label">Select Talent Specialist *</label>
                    <select
                      className="tw-form-select"
                      value={formData.candidateOrEmployeeName}
                      onChange={(e) => setFormData({ ...formData, candidateOrEmployeeName: e.target.value })}
                    >
                      {employees.map((emp) => (
                        <option key={emp.id || emp._id} value={emp.name}>
                          {emp.name} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Select Corporate Client *</label>
                    <select
                      className="tw-form-select"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    >
                      {clients.map((cli) => (
                        <option key={cli.id || cli._id} value={cli.companyName}>
                          {cli.companyName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Assigned Role Title *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. Principal Cloud Infrastructure Architect"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Monthly Billing Rate ($) *</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.billingRate}
                      onChange={(e) => setFormData({ ...formData, billingRate: Number(e.target.value) })}
                      min="1000"
                      required
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Deployment Start Date *</label>
                    <input
                      type="date"
                      className="tw-form-input"
                      value={formData.deploymentDate}
                      onChange={(e) => setFormData({ ...formData, deploymentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Duration (Months)</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.durationMonths}
                      onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Contract Scope & SOW Notes</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="SOW reference number, client reporting lead, hours overlap..."
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
                  Deploy Talent
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
              <h2 className="tw-modal-title">Terminate Placement</h2>
              <button className="tw-modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to terminate this active client placement? This will adjust billing analytics accordingly.
            </div>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Confirm Termination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementsView;
