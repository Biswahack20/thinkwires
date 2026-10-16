import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const ClientsView = () => {
  const { showToast, activeRole } = useOutletContext();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Financial Services & Banking',
    status: 'Active',
    location: 'Bangalore, India',
    contractType: 'Staff Augmentation / Retainer',
  });

  const [formError, setFormError] = useState('');

  const fetchClients = () => {
    setLoading(true);
    adminApi
      .getClients({ search, industry: industryFilter, status: statusFilter })
      .then((res) => {
        setClients(res.clients || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load clients: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchClients();
  }, [search, industryFilter, statusFilter]);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot register clients.');
      return;
    }
    setEditingClient(null);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      industry: 'Information Technology',
      status: 'Active',
      location: 'Remote / Global',
      contractType: 'Staff Augmentation / Retainer',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (cli) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit client records.');
      return;
    }
    setEditingClient(cli);
    setFormData({
      companyName: cli.companyName || '',
      contactPerson: cli.contactPerson || '',
      email: cli.email || '',
      phone: cli.phone || '',
      industry: cli.industry || 'Information Technology',
      status: cli.status || 'Active',
      location: cli.location || 'Remote',
      contractType: cli.contractType || 'Staff Augmentation',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
      setFormError('Please enter Company Name, Contact Person, and Email.');
      return;
    }

    if (editingClient) {
      adminApi
        .updateClient(editingClient.id || editingClient._id, formData)
        .then(() => {
          showToast(`Client ${formData.companyName} updated successfully.`);
          setModalOpen(false);
          fetchClients();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createClient(formData)
        .then(() => {
          showToast(`Client ${formData.companyName} created.`);
          setModalOpen(false);
          fetchClients();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot delete clients.');
      return;
    }
    adminApi
      .deleteClient(id)
      .then(() => {
        showToast('Client account archived.');
        setDeleteConfirmId(null);
        fetchClients();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Corporate Client Accounts</h1>
          <p className="tw-view-subtitle">
            Enterprise partners sourcing engineering manpower, dedicated squads, and cross-border EOR solutions.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          ➕ Register Client
        </button>
      </div>

      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <div className="tw-table-filters">
            <input
              type="text"
              className="tw-filter-input"
              placeholder="Search company or contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '240px' }}
            />

            <select
              className="tw-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Total clients: <strong>{clients.length}</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Industry</th>
                <th>Location & Engagement</th>
                <th>Status</th>
                <th>Requisitions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    Loading corporate accounts...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    No clients found matching the query.
                  </td>
                </tr>
              ) : (
                clients.map((cli) => (
                  <tr key={cli.id || cli._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cli.companyName}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B' }}>{cli.email}</div>
                    </td>
                    <td>
                      <div>{cli.contactPerson}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748B' }}>{cli.phone}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: '#F1F5F9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          color: '#475569',
                          fontWeight: 500,
                        }}
                      >
                        {cli.industry}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>{cli.location}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{cli.contractType}</div>
                    </td>
                    <td>
                      <span className={`tw-badge ${cli.status.toLowerCase()}`}>{cli.status}</span>
                    </td>
                    <td>
                      <span className="tw-badge available">{cli.activeRequirementsCount || 0} active</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="tw-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => openEditModal(cli)}
                          title="Edit Client"
                        >
                          ✏️
                        </button>
                        <button
                          className="tw-action-icon-btn delete"
                          onClick={() => setDeleteConfirmId(cli.id || cli._id)}
                          title="Delete Client"
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

      {/* Add / Edit Client Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal">
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">
                {editingClient ? `Edit ${editingClient.companyName}` : 'Register New Corporate Client'}
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
                    <label className="tw-form-label">Company Name *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Health Systems"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Contact Person *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="Dr. Eleanor Vance (CTO)"
                      required
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Corporate Email *</label>
                    <input
                      type="email"
                      className="tw-form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@company.com"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Phone Number</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (415) 555-0199"
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Industry</label>
                    <select
                      className="tw-form-select"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    >
                      <option value="Financial Services & Banking">Financial Services & Banking</option>
                      <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                      <option value="Enterprise SaaS">Enterprise SaaS</option>
                      <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                      <option value="Information Technology">Information Technology</option>
                    </select>
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Account Status</label>
                    <select
                      className="tw-form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Headquarters / Location</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Boston, MA / Remote"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Contract Type</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                      placeholder="Staff Augmentation / EOR"
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
                  {editingClient ? 'Save Changes' : 'Register Client'}
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
              <h2 className="tw-modal-title">Archive Client Account</h2>
              <button className="tw-modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to remove this client account from active tracking?
            </div>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Confirm Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
