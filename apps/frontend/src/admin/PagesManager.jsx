import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const PagesManager = () => {
  const { showToast, activeRole } = useOutletContext();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Core Website',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'published',
  });

  const [formError, setFormError] = useState('');

  const fetchPages = () => {
    setLoading(true);
    adminApi
      .getCmsPages()
      .then((res) => {
        setPages(res.pages || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load CMS pages: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot create pages.');
      return;
    }
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Solutions Page',
      content: 'Enter markdown or HTML content here...',
      metaTitle: '',
      metaDescription: '',
      status: 'draft',
    });
    setFormError('');
    setEditorOpen(true);
  };

  const openEditModal = (pg) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit pages.');
      return;
    }
    setEditingPage(pg);
    setFormData({
      title: pg.title || '',
      slug: pg.slug || '',
      category: pg.category || 'Core Website',
      content: pg.content || '',
      metaTitle: pg.metaTitle || '',
      metaDescription: pg.metaDescription || '',
      status: pg.status || 'published',
    });
    setFormError('');
    setEditorOpen(true);
  };

  const handleTogglePublish = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot change publication status.');
      return;
    }
    adminApi
      .togglePublishCmsPage(id)
      .then((res) => {
        showToast(`Page is now ${res.status}`);
        fetchPages();
      })
      .catch((err) => showToast(`Status toggle failed: ${err.message}`));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      setFormError('Title, URL Slug, and Content body are required.');
      return;
    }

    if (editingPage) {
      adminApi
        .updateCmsPage(editingPage.id || editingPage._id, formData)
        .then(() => {
          showToast(`Page '${formData.title}' updated successfully.`);
          setEditorOpen(false);
          fetchPages();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createCmsPage(formData)
        .then(() => {
          showToast(`Page '${formData.title}' created successfully.`);
          setEditorOpen(false);
          fetchPages();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot delete pages.');
      return;
    }
    adminApi
      .deleteCmsPage(id)
      .then(() => {
        showToast('Page deleted permanently.');
        setDeleteConfirmId(null);
        fetchPages();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Website Pages Management</h1>
          <p className="tw-view-subtitle">
            Manage page content, URL slugs, publication statuses, SEO meta properties, and live web previews.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          ➕ Create New Page
        </button>
      </div>

      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <h2 className="tw-card-title">All Website Pages ({pages.length})</h2>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Instant publishing engine connected to ThinkWires routes
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Page Title</th>
                <th>URL Slug</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Updated By</th>
                <th>Published Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    Loading pages...
                  </td>
                </tr>
              ) : (
                pages.map((pg) => (
                  <tr key={pg.id || pg._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{pg.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pg.content}
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', backgroundColor: '#F1F5F9', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        /{pg.slug}
                      </code>
                    </td>
                    <td>{pg.category}</td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(pg.id || pg._id)}
                        className={`tw-badge ${pg.status.toLowerCase()}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Click to toggle Draft / Published"
                      >
                        {pg.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td>{pg.lastUpdatedBy || 'Admin'}</td>
                    <td>{pg.publishedAt ? new Date(pg.publishedAt).toLocaleDateString() : 'Unpublished'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="tw-action-btn-group" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => setPreviewPage(pg)}
                          title="Preview Page"
                        >
                          👁️
                        </button>
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => openEditModal(pg)}
                          title="Edit Page"
                        >
                          ✏️
                        </button>
                        <button
                          className="tw-action-icon-btn delete"
                          onClick={() => setDeleteConfirmId(pg.id || pg._id)}
                          title="Delete Page"
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

      {/* Page Preview Modal */}
      {previewPage && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '680px' }}>
            <div className="tw-modal-header">
              <div>
                <span className="tw-badge deployed" style={{ marginBottom: '0.25rem' }}>
                  Live Preview: /{previewPage.slug}
                </span>
                <h2 className="tw-modal-title">{previewPage.title}</h2>
              </div>
              <button className="tw-modal-close-btn" onClick={() => setPreviewPage(null)}>
                ✕
              </button>
            </div>

            <div className="tw-modal-body">
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '0.5rem' }}>
                  <strong>Meta Title:</strong> {previewPage.metaTitle || previewPage.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  <strong>Meta Description:</strong> {previewPage.metaDescription || 'No description provided.'}
                </div>
              </div>

              <div
                style={{
                  lineHeight: '1.7',
                  fontSize: '0.92rem',
                  color: '#172033',
                  backgroundColor: '#FFFFFF',
                  padding: '1.5rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
              >
                {previewPage.content}
              </div>
            </div>

            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setPreviewPage(null)}>
                Close Preview
              </button>
              <button
                className="tw-btn-primary"
                onClick={() => {
                  setPreviewPage(null);
                  openEditModal(previewPage);
                }}
              >
                Edit Page Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Page Modal */}
      {editorOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '640px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">{editingPage ? `Edit Page: ${editingPage.title}` : 'Create Website Page'}</h2>
              <button className="tw-modal-close-btn" onClick={() => setEditorOpen(false)}>
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
                    <label className="tw-form-label">Page Title *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Talent Cloud Bench"
                      required
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">URL Slug (e.g. talent-cloud) *</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="talent-cloud"
                      required
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Page Category</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Core Website / Solutions"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Initial Status</label>
                    <select
                      className="tw-form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Page Content (Body) *</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="6"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter full page content, feature descriptions, and company copy..."
                    required
                  ></textarea>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">SEO Meta Title</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="ThinkWires — Transforming Global Tech Talent"
                  />
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">SEO Meta Description</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="2"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Search engine summary text..."
                  ></textarea>
                </div>
              </div>

              <div className="tw-modal-footer">
                <button
                  type="button"
                  className="tw-btn-secondary"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tw-btn-primary">
                  {editingPage ? 'Save Changes' : 'Create Page'}
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
              <h2 className="tw-modal-title">Delete Page</h2>
              <button className="tw-modal-close-btn" onClick={() => setDeleteConfirmId(null)}>
                ✕
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to permanently delete this page? This will remove its route mapping and SEO index metadata.
            </div>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={() => handleDelete(deleteConfirmId)}>
                Delete Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesManager;
