import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';
import { BellIcon, TrashIcon, CloseIcon, AlertCircleIcon } from './AdminIcons';

const AnnouncementsManager = () => {
  const { showToast, activeRole } = useOutletContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: 'All',
    priority: 'Normal',
    status: 'published',
  });

  const [formError, setFormError] = useState('');

  const fetchAnnouncements = () => {
    setLoading(true);
    adminApi
      .getAnnouncements()
      .then((res) => {
        setAnnouncements(res.announcements || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load announcements: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleTogglePublish = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot toggle announcement status.');
      return;
    }
    adminApi
      .togglePublishAnnouncement(id)
      .then((res) => {
        showToast(`Announcement is now ${res.status}`);
        fetchAnnouncements();
      })
      .catch((err) => showToast(`Action failed: ${err.message}`));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      setFormError('Title and message are required.');
      return;
    }

    adminApi
      .createAnnouncement(formData)
      .then(() => {
        showToast(`Broadcast '${formData.title}' created.`);
        setModalOpen(false);
        fetchAnnouncements();
      })
      .catch((err) => setFormError(err.message));
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot delete announcements.');
      return;
    }
    adminApi
      .deleteAnnouncement(id)
      .then(() => {
        showToast('Announcement removed.');
        setDeleteConfirmId(null);
        fetchAnnouncements();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Corporate Announcements & Broadcasts</h1>
          <p className="tw-view-subtitle">
            Publish operational notices to client portals, engineer benches, and
            the internal admin notification center.
          </p>
        </div>

        <button
          className="tw-btn-primary"
          onClick={() => {
            if (activeRole === 'viewer') {
              showToast('Viewer accounts cannot create broadcasts.');
              return;
            }
            setFormData({
              title: '',
              message: '',
              audience: 'All',
              priority: 'Normal',
              status: 'published',
            });
            setFormError('');
            setModalOpen(true);
          }}
        >
          <BellIcon size={15} />
          <span>New Broadcast</span>
        </button>
      </div>

      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <h2 className="tw-card-title">
            Live Broadcasts ({announcements.length})
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Broadcasts appear in top navigation notification popups
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Broadcast Title</th>
                <th>Message Content</th>
                <th>Target Audience</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Author</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#64748B',
                    }}
                  >
                    Loading announcements...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#64748B',
                    }}
                  >
                    No announcements published.
                  </td>
                </tr>
              ) : (
                announcements.map((ann) => (
                  <tr key={ann.id || ann._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ann.title}</div>
                    </td>
                    <td>
                      <div
                        style={{
                          maxWidth: '300px',
                          fontSize: '0.78rem',
                          color: '#475569',
                        }}
                      >
                        {ann.message}
                      </div>
                    </td>
                    <td>
                      <span className="tw-badge available">{ann.audience}</span>
                    </td>
                    <td>
                      <span
                        className={`tw-badge ${String(ann.priority || 'normal').toLowerCase()}`}
                      >
                        {ann.priority}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(ann.id || ann._id)}
                        className={`tw-badge ${String(ann.status || 'published').toLowerCase()}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Click to toggle status"
                      >
                        {ann.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td>{ann.author || 'Admin'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="tw-action-icon-btn delete"
                        onClick={() => setDeleteConfirmId(ann.id || ann._id)}
                        title="Delete Announcement"
                        style={{ marginLeft: 'auto' }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '520px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Broadcast Announcement</h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
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

                <div className="tw-form-group">
                  <label className="tw-form-label">Announcement Title *</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Q4 Statutory Labor Audit Completed"
                    required
                  />
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Message Content *</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="3"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Details of the announcement broadcasted to users..."
                    required
                  ></textarea>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Target Audience</label>
                    <select
                      className="tw-form-select"
                      value={formData.audience}
                      onChange={(e) =>
                        setFormData({ ...formData, audience: e.target.value })
                      }
                    >
                      <option value="All">All Portals</option>
                      <option value="Clients">Clients Only</option>
                      <option value="Staff">Internal Staff Only</option>
                      <option value="Public">Public Banner</option>
                    </select>
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Priority Level</label>
                    <select
                      className="tw-form-select"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent Alert</option>
                    </select>
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Publication Status</label>
                  <select
                    className="tw-form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="published">Publish Immediately</option>
                    <option value="draft">Save as Draft</option>
                  </select>
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
                  Broadcast Now
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
              <h2 className="tw-modal-title">Delete Announcement</h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to remove this announcement broadcast?
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
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsManager;
