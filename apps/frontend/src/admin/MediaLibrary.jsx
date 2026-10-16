import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const MediaLibrary = () => {
  const { showToast, activeRole } = useOutletContext();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    fileUrl: '',
    fileType: 'image/jpeg',
    fileSizeKb: 250,
    dimensions: '1920x1080',
    altText: '',
  });

  const [formError, setFormError] = useState('');

  const fetchMedia = () => {
    setLoading(true);
    adminApi
      .getCmsMedia()
      .then((res) => {
        setMedia(res.media || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load media: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast('Asset URL copied to clipboard! 📋');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fileUrl.trim()) {
      setFormError('Please enter asset Title and URL.');
      return;
    }

    adminApi
      .createCmsMedia(formData)
      .then(() => {
        showToast(`Asset '${formData.title}' registered.`);
        setModalOpen(false);
        fetchMedia();
      })
      .catch((err) => setFormError(err.message));
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot delete media assets.');
      return;
    }
    adminApi
      .deleteCmsMedia(id)
      .then(() => {
        showToast('Media asset removed.');
        setDeleteConfirmId(null);
        fetchMedia();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Digital Media Library</h1>
          <p className="tw-view-subtitle">
            Manage high-resolution branding assets, blog cover photos, team graphics, and corporate collateral.
          </p>
        </div>

        <button
          className="tw-btn-primary"
          onClick={() => {
            if (activeRole === 'viewer') {
              showToast('Viewer accounts cannot upload media.');
              return;
            }
            setFormData({
              title: '',
              fileUrl: '',
              fileType: 'image/jpeg',
              fileSizeKb: 180,
              dimensions: '1200x800',
              altText: '',
            });
            setFormError('');
            setModalOpen(true);
          }}
        >
          ➕ Register Asset (Demo)
        </button>
      </div>

      {/* Notice on Modular Storage */}
      <div className="tw-demo-notice-banner" style={{ marginBottom: '1.5rem' }}>
        <div className="tw-demo-notice-content">
          <span className="tw-demo-pill">MODULAR STORAGE</span>
          <span>
            Metadata is persisted in MongoDB while binary media assets are referenced via external CDN/Cloud URLs to prevent database bloat.
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          Loading media library...
        </div>
      ) : media.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          No media assets found in library.
        </div>
      ) : (
        <div className="tw-media-grid">
          {media.map((item) => (
            <div key={item.id || item._id} className="tw-media-card">
              <div className="tw-media-preview">
                <img
                  src={item.fileUrl}
                  alt={item.altText || item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/logo-BAtHwehS.png';
                  }}
                />
              </div>

              <div className="tw-media-info">
                <div className="tw-media-title" title={item.title}>
                  {item.title}
                </div>
                <div className="tw-media-meta">
                  {item.dimensions} • {item.fileSizeKb} KB
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                  {item.fileType}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.75rem',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '0.5rem',
                  }}
                >
                  <button
                    onClick={() => handleCopyUrl(item.fileUrl)}
                    style={{
                      background: 'none',
                      border: '1px solid #E2E8F0',
                      borderRadius: '4px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#008F68',
                      cursor: 'pointer',
                    }}
                  >
                    Copy URL
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id || item._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                    title="Delete Asset"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {modalOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '520px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Register Media Asset</h2>
              <button className="tw-modal-close-btn" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
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

                <div className="tw-form-group">
                  <label className="tw-form-label">Asset Title *</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Enterprise Client Kickoff Banner"
                    required
                  />
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">File URL or Path *</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder="/images/about-hero.jpg or https://..."
                    required
                  />
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.25rem' }}>
                    Demo implementation accepts static assets or public image URLs.
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">MIME Type</label>
                    <select
                      className="tw-form-select"
                      value={formData.fileType}
                      onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    >
                      <option value="image/jpeg">image/jpeg</option>
                      <option value="image/png">image/png</option>
                      <option value="image/webp">image/webp</option>
                      <option value="image/svg+xml">image/svg+xml</option>
                      <option value="application/pdf">application/pdf</option>
                    </select>
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">File Size (KB)</label>
                    <input
                      type="number"
                      className="tw-form-input"
                      value={formData.fileSizeKb}
                      onChange={(e) => setFormData({ ...formData, fileSizeKb: Number(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Dimensions</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="1920x1080"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Accessibility Alt Text</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.altText}
                      onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                      placeholder="Descriptive image text"
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
                  Save Asset
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
              <h2 className="tw-modal-title">Delete Media Asset</h2>
              <button className="tw-modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to remove this media record? Any pages referencing this URL will need to be updated.
            </div>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
