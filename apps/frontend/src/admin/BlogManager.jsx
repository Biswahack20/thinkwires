import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  EditIcon,
  EyeIcon,
  TrashIcon,
  CloseIcon,
  AlertCircleIcon,
} from './AdminIcons';

const BlogManager = () => {
  const { showToast, activeRole } = useOutletContext();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    body: '',
    authorName: 'Biswarupa Swain',
    authorRole: 'Chief Technology Advisor',
    category: 'Industry Insights',
    featuredImageUrl: '/assets/blog_ai_gcc_dashboard.jpg',
    tags: 'GCC, Staffing, Tech Hubs',
    status: 'published',
  });

  const [formError, setFormError] = useState('');

  const fetchArticles = () => {
    setLoading(true);
    adminApi
      .getCmsArticles({ search, status: statusFilter })
      .then((res) => {
        setArticles(res.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load articles: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, [search, statusFilter]);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot author blog articles.');
      return;
    }
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      body: '',
      authorName: 'Biswarupa Swain',
      authorRole: 'Chief Technology Advisor',
      category: 'Industry Insights',
      featuredImageUrl: '/assets/blog_ai_gcc_dashboard.jpg',
      tags: 'GCC, Staffing, Enterprise Innovation',
      status: 'draft',
    });
    setFormError('');
    setEditorOpen(true);
  };

  const openEditModal = (art) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit articles.');
      return;
    }
    setEditingArticle(art);
    setFormData({
      title: art.title || '',
      slug: art.slug || '',
      summary: art.summary || '',
      body: art.body || '',
      authorName: art.author?.name || 'Thinkwires Editorial',
      authorRole: art.author?.role || 'Staff Contributor',
      category: art.category || 'Industry Insights',
      featuredImageUrl:
        art.featuredImageUrl || '/assets/blog_ai_gcc_dashboard.jpg',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags || '',
      status: art.status || 'published',
    });
    setFormError('');
    setEditorOpen(true);
  };

  const handleTogglePublish = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot change article status.');
      return;
    }
    adminApi
      .togglePublishCmsArticle(id)
      .then((res) => {
        showToast(`Article status changed to ${res.status}`);
        fetchArticles();
      })
      .catch((err) => showToast(`Status change failed: ${err.message}`));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.summary.trim() ||
      !formData.body.trim()
    ) {
      setFormError('Please enter article Title, Summary, and Body content.');
      return;
    }

    const payload = {
      ...formData,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
      },
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (editingArticle) {
      adminApi
        .updateCmsArticle(editingArticle.id || editingArticle._id, payload)
        .then(() => {
          showToast(`Article '${formData.title}' updated successfully.`);
          setEditorOpen(false);
          fetchArticles();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createCmsArticle(payload)
        .then(() => {
          showToast(`Article '${formData.title}' created successfully.`);
          setEditorOpen(false);
          fetchArticles();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleDelete = (id) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot delete articles.');
      return;
    }
    adminApi
      .deleteCmsArticle(id)
      .then(() => {
        showToast('Article deleted.');
        setDeleteConfirmId(null);
        fetchArticles();
      })
      .catch((err) => showToast(`Delete failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Blog & Editorial Management</h1>
          <p className="tw-view-subtitle">
            Publish thought leadership articles, research papers, GCC
            benchmarks, and manpower supply whitepapers.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          <EditIcon size={15} />
          <span>Author Article</span>
        </button>
      </div>

      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <div className="tw-table-filters">
            <input
              type="text"
              className="tw-filter-input"
              placeholder="Search title, summary, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '250px' }}
            />

            <select
              className="tw-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Articles count: <strong>{articles.length}</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Views</th>
                <th>Published</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#64748B',
                    }}
                  >
                    Loading articles...
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id || art._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{art.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        /{art.slug}
                      </div>
                    </td>
                    <td>
                      <div>{art.author?.name || 'Staff'}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                        {art.author?.role}
                      </div>
                    </td>
                    <td>
                      <span className="tw-badge available">{art.category}</span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.2rem',
                          flexWrap: 'wrap',
                          maxWidth: '160px',
                        }}
                      >
                        {(art.tags || []).slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '4px',
                              backgroundColor: '#F1F5F9',
                              color: '#475569',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(art.id || art._id)}
                        className={`tw-badge ${art.status.toLowerCase()}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        title="Click to toggle status"
                      >
                        {art.status === 'published' ? '● Live' : '○ Draft'}
                      </button>
                    </td>
                    <td>
                      <strong>{(art.viewsCount || 0).toLocaleString()}</strong>
                    </td>
                    <td>
                      {art.publishedAt
                        ? new Date(art.publishedAt).toLocaleDateString()
                        : 'Unpublished'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div
                        className="tw-action-btn-group"
                        style={{ justifyContent: 'flex-end' }}
                      >
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => setPreviewArticle(art)}
                          title="Preview Article"
                        >
                          <EyeIcon size={14} />
                        </button>
                        <button
                          className="tw-action-icon-btn"
                          onClick={() => openEditModal(art)}
                          title="Edit Article"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          className="tw-action-icon-btn delete"
                          onClick={() => setDeleteConfirmId(art.id || art._id)}
                          title="Delete Article"
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
      </div>

      {/* Article Preview Modal */}
      {previewArticle && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '680px' }}>
            <div className="tw-modal-header">
              <div>
                <span
                  className="tw-badge deployed"
                  style={{ marginBottom: '0.25rem' }}
                >
                  {previewArticle.category} •{' '}
                  {previewArticle.readTime || '4 min'}
                </span>
                <h2 className="tw-modal-title">{previewArticle.title}</h2>
              </div>
              <button
                className="tw-modal-close-btn"
                onClick={() => setPreviewArticle(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="tw-modal-body">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: '#64748B',
                }}
              >
                <strong>By {previewArticle.author?.name}</strong> •{' '}
                {previewArticle.author?.role}
              </div>

              <div
                style={{
                  fontStyle: 'italic',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  borderLeft: '4px solid #008F68',
                  fontSize: '0.88rem',
                  color: '#334155',
                }}
              >
                {previewArticle.summary}
              </div>

              <div
                style={{
                  lineHeight: '1.7',
                  fontSize: '0.9rem',
                  color: '#172033',
                }}
              >
                {previewArticle.body}
              </div>
            </div>

            <div className="tw-modal-footer">
              <button
                className="tw-btn-secondary"
                onClick={() => setPreviewArticle(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editorOpen && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '640px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">
                {editingArticle ? `Edit Article` : 'Author New Article'}
              </h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setEditorOpen(false)}
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

                <div className="tw-form-group">
                  <label className="tw-form-label">
                    Article Headline / Title *
                  </label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. GCC 2.0: Scaling Tech Delivery Centers in India"
                    required
                  />
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">URL Slug</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="gcc-2-scaling-tech-delivery"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Category</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      placeholder="Industry Insights / EOR"
                    />
                  </div>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Author Name</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.authorName}
                      onChange={(e) =>
                        setFormData({ ...formData, authorName: e.target.value })
                      }
                    />
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
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">
                    Executive Summary / Abstract *
                  </label>
                  <textarea
                    className="tw-form-textarea"
                    rows="2"
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    placeholder="Concise 2-sentence summary for preview cards..."
                    required
                  ></textarea>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Full Article Body *</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="6"
                    value={formData.body}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    placeholder="Enter full article paragraphs, analysis, benchmarks..."
                    required
                  ></textarea>
                </div>

                <div className="tw-form-row">
                  <div className="tw-form-group">
                    <label className="tw-form-label">Featured Image URL</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.featuredImageUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuredImageUrl: e.target.value,
                        })
                      }
                      placeholder="/assets/blog_ai_gcc_dashboard.jpg"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="GCC, India Tech, Staffing"
                    />
                  </div>
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
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
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
              <h2 className="tw-modal-title">Delete Article</h2>
              <button
                className="tw-modal-close-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <div className="tw-modal-body">
              Are you sure you want to permanently delete this blog article from
              the CMS?
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
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
