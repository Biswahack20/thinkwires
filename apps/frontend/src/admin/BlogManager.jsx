import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  EditIcon,
  EyeIcon,
  TrashIcon,
  CloseIcon,
  AlertCircleIcon,
} from './AdminIcons';

// Lucide/Feather upload cloud icon
const UploadCloudIcon = ({ size = 20, color = 'currentColor', style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    <polyline points="16 16 12 12 8 16" />
  </svg>
);

// Reads an image file from the user's computer/file manager,
// resizes via HTML5 canvas if necessary to keep base64 payload optimized,
// and returns a Base64 data URL string.
const processImageFile = (file, maxDim = 1600, quality = 0.88) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'));
    if (!file.type || !file.type.startsWith('image/')) {
      return reject(
        new Error('Selected file is not an image (PNG, JPG, WebP, SVG supported).')
      );
    }

    // Direct read for vector or small files
    if (file.type === 'image/svg+xml' || file.size < 120 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const outputType =
          file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
};

// Helper to render article body paragraphs and markdown images in preview modal
const renderArticleContent = (content) => {
  if (!content) return null;
  const blocks = String(content)
    .split(/\n\n+/)
    .filter((p) => p.trim() !== '');

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      return (
        <figure
          key={idx}
          style={{
            margin: '1.25rem 0',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            padding: '0.5rem',
            borderRadius: '8px',
          }}
        >
          <img
            src={src}
            alt={alt || 'Blog visual'}
            style={{
              maxWidth: '100%',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              maxHeight: '360px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {alt && (
            <figcaption
              style={{
                fontSize: '0.75rem',
                color: '#64748B',
                marginTop: '0.35rem',
                fontStyle: 'italic',
              }}
            >
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }
    return (
      <p
        key={idx}
        style={{
          lineHeight: '1.7',
          fontSize: '0.9rem',
          color: '#172033',
          marginBottom: '0.85rem',
          whiteSpace: 'pre-line',
        }}
      >
        {block}
      </p>
    );
  });
};

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
    authorAvatar: '',
    category: 'Industry Insights',
    featuredImageUrl: '/assets/blog_ai_gcc_dashboard.jpg',
    tags: 'GCC, Staffing, Tech Hubs',
    status: 'published',
  });

  const [formError, setFormError] = useState('');

  // Image Upload File References & Upload Mode States
  const featuredFileInputRef = useRef(null);
  const authorFileInputRef = useRef(null);
  const bodyImageFileInputRef = useRef(null);

  const [featuredInputMode, setFeaturedInputMode] = useState('file'); // 'file' | 'url'
  const [authorInputMode, setAuthorInputMode] = useState('file'); // 'file' | 'url'
  const [isDraggingFeatured, setIsDraggingFeatured] = useState(false);

  const handleFeaturedFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 0.88);
      setFormData((prev) => ({ ...prev, featuredImageUrl: dataUrl }));
      showToast(`Featured banner loaded from '${file.name}'.`);
    } catch (err) {
      showToast(err.message || 'Could not process featured image.');
    }
    e.target.value = '';
  };

  const handleFeaturedDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFeatured(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 0.88);
      setFormData((prev) => ({ ...prev, featuredImageUrl: dataUrl }));
      showToast(`Featured banner loaded from '${file.name}'.`);
    } catch (err) {
      showToast(err.message || 'Could not process dropped image.');
    }
  };

  const handleAuthorFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 500, 0.88);
      setFormData((prev) => ({ ...prev, authorAvatar: dataUrl }));
      showToast(`Author photo loaded from '${file.name}'.`);
    } catch (err) {
      showToast(err.message || 'Could not process author photo.');
    }
    e.target.value = '';
  };

  const handleBodyImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1400, 0.88);
      const defaultCaption = file.name.replace(/\.[^/.]+$/, '');
      const caption =
        window.prompt(
          'Enter Image Caption / Alt text (optional):',
          defaultCaption
        ) ||
        defaultCaption ||
        'Visual Analysis';
      const mdImage = `\n\n![${caption}](${dataUrl})\n\n`;
      setFormData((prev) => ({
        ...prev,
        body: (prev.body || '') + mdImage,
      }));
      showToast(`Image '${file.name}' inserted into body.`);
    } catch (err) {
      showToast(err.message || 'Could not process body image.');
    }
    e.target.value = '';
  };

  const handleInsertBodyImageUrl = () => {
    const url = window.prompt('Enter Image URL:');
    if (!url) return;
    const caption =
      window.prompt('Enter Image Caption / Alt text (optional):') ||
      'Visual Analysis';
    const mdImage = `\n\n![${caption}](${url})\n\n`;
    setFormData((prev) => ({
      ...prev,
      body: (prev.body || '') + mdImage,
    }));
  };

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
    let isMounted = true;
    adminApi
      .getCmsArticles({ search, status: statusFilter })
      .then((res) => {
        if (isMounted) {
          setArticles(res.articles || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoading(false);
          showToast(`Failed to load articles: ${err.message}`);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [search, statusFilter, showToast]);

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
      authorAvatar: '',
      category: 'Industry Insights',
      featuredImageUrl: '',
      tags: 'GCC, Staffing, Enterprise Innovation',
      status: 'draft',
    });
    setFeaturedInputMode('file');
    setAuthorInputMode('file');
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
      summary: art.summary || art.excerpt || '',
      body: art.body || art.content || '',
      authorName: art.author?.name || 'Thinkwires Editorial',
      authorRole: art.author?.role || 'Staff Contributor',
      authorAvatar:
        art.author?.avatar || art.author?.imageUrl || art.authorAvatar || '',
      category: art.category || 'Industry Insights',
      featuredImageUrl:
        art.featuredImageUrl || '/assets/blog_ai_gcc_dashboard.jpg',
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : art.tags || '',
      status: art.status || 'published',
    });
    setFeaturedInputMode('file');
    setAuthorInputMode('file');
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

    const resolvedInitials = formData.authorName
      ? formData.authorName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'TW';

    const payload = {
      ...formData,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
        avatar: formData.authorAvatar,
        initials: resolvedInitials,
      },
      authorAvatar: formData.authorAvatar,
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        {art.featuredImageUrl && (
                          <img
                            src={art.featuredImageUrl}
                            alt=""
                            style={{
                              width: '38px',
                              height: '28px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              border: '1px solid #E2E8F0',
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{art.title}</div>
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: '#64748B',
                            }}
                          >
                            /{art.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        {art.author?.avatar ? (
                          <img
                            src={art.author.avatar}
                            alt={art.author.name}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1px solid #CBD5E1',
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#E2E8F0',
                              color: '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {art.author?.initials ||
                              (art.author?.name
                                ? art.author.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()
                                : 'TW')}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {art.author?.name || 'Staff'}
                          </div>
                          <div
                            style={{
                              fontSize: '0.7rem',
                              color: '#64748B',
                            }}
                          >
                            {art.author?.role}
                          </div>
                        </div>
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
              {previewArticle.featuredImageUrl && (
                <div
                  style={{
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={previewArticle.featuredImageUrl}
                    alt={previewArticle.title}
                    style={{
                      width: '100%',
                      maxHeight: '240px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: '#64748B',
                }}
              >
                {previewArticle.author?.avatar ? (
                  <img
                    src={previewArticle.author.avatar}
                    alt={previewArticle.author.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid #CBD5E1',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#E2E8F0',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                    }}
                  >
                    {previewArticle.author?.initials ||
                      (previewArticle.author?.name
                        ? previewArticle.author.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                        : 'TW')}
                  </div>
                )}
                <div>
                  <strong>By {previewArticle.author?.name || 'Staff'}</strong> •{' '}
                  {previewArticle.author?.role || 'Staff Contributor'}
                </div>
              </div>

              {(previewArticle.summary || previewArticle.excerpt) && (
                <div
                  style={{
                    fontStyle: 'italic',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    borderLeft: '4px solid #008F68',
                    fontSize: '0.88rem',
                    color: '#334155',
                  }}
                >
                  {previewArticle.summary || previewArticle.excerpt}
                </div>
              )}

              <div style={{ color: '#172033' }}>
                {renderArticleContent(
                  previewArticle.body ||
                    previewArticle.content ||
                    previewArticle.summary
                )}
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
                      placeholder="e.g. Biswarupa Swain"
                    />
                  </div>
                  <div className="tw-form-group">
                    <label className="tw-form-label">Author Role / Designation</label>
                    <input
                      type="text"
                      className="tw-form-input"
                      value={formData.authorRole}
                      onChange={(e) =>
                        setFormData({ ...formData, authorRole: e.target.value })
                      }
                      placeholder="e.g. Chief Technology Advisor"
                    />
                  </div>
                </div>

                <div className="tw-form-group">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <label className="tw-form-label" style={{ marginBottom: 0 }}>
                      Author Image / Avatar
                    </label>
                    <div
                      style={{
                        display: 'inline-flex',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '6px',
                        padding: '2px',
                        gap: '2px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setAuthorInputMode('file')}
                        style={{
                          border: 'none',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor:
                            authorInputMode === 'file' ? '#FFFFFF' : 'transparent',
                          color:
                            authorInputMode === 'file' ? '#0F172A' : '#64748B',
                          boxShadow:
                            authorInputMode === 'file'
                              ? '0 1px 2px rgba(0,0,0,0.06)'
                              : 'none',
                        }}
                      >
                        📁 Upload from Device
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthorInputMode('url')}
                        style={{
                          border: 'none',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor:
                            authorInputMode === 'url' ? '#FFFFFF' : 'transparent',
                          color:
                            authorInputMode === 'url' ? '#0F172A' : '#64748B',
                          boxShadow:
                            authorInputMode === 'url'
                              ? '0 1px 2px rgba(0,0,0,0.06)'
                              : 'none',
                        }}
                      >
                        🔗 Image URL
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input for Author Photo */}
                  <input
                    type="file"
                    ref={authorFileInputRef}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={handleAuthorFileSelect}
                  />

                  {authorInputMode === 'file' ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                      }}
                    >
                      {formData.authorAvatar ? (
                        <img
                          src={formData.authorAvatar}
                          alt="Author Preview"
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #059669',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: '#E2E8F0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {formData.authorName
                            ? formData.authorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()
                            : 'TW'}
                        </div>
                      )}

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => authorFileInputRef.current?.click()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              borderRadius: '6px',
                              backgroundColor: '#FFFFFF',
                              color: '#0F172A',
                              border: '1px solid #CBD5E1',
                              cursor: 'pointer',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                          >
                            📁 Choose Photo from Files / Document
                          </button>
                          {formData.authorAvatar && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  authorAvatar: '',
                                }))
                              }
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#EF4444',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: '0.2rem 0.4rem',
                              }}
                            >
                              ✕ Remove Photo
                            </button>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#64748B',
                            marginTop: '0.3rem',
                            display: 'block',
                          }}
                        >
                          {formData.authorAvatar
                            ? 'Custom profile photo loaded from your computer.'
                            : 'Pick a headshot or avatar from your computer (JPG, PNG, WebP).'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <input
                        type="text"
                        className="tw-form-input"
                        value={formData.authorAvatar}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            authorAvatar: e.target.value,
                          })
                        }
                        placeholder="https://... or /assets/authors/avatar.jpg"
                        style={{ flex: 1 }}
                      />
                      {formData.authorAvatar ? (
                        <img
                          src={formData.authorAvatar}
                          alt="Author Preview"
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #E2E8F0',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: '#E2E8F0',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {formData.authorName
                            ? formData.authorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()
                            : 'TW'}
                        </div>
                      )}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748B',
                      marginTop: '0.3rem',
                      display: 'block',
                    }}
                  >
                    Author profile picture displayed on blog cards, insights carousel, and reader modal.
                  </span>
                </div>

                <div className="tw-form-row">
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.4rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <label className="tw-form-label" style={{ marginBottom: 0 }}>
                      Full Article Body *
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      {/* Hidden file input for inserting image into markdown body */}
                      <input
                        type="file"
                        ref={bodyImageFileInputRef}
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        style={{ display: 'none' }}
                        onChange={handleBodyImageFileSelect}
                      />
                      <button
                        type="button"
                        onClick={() => bodyImageFileInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.7rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          cursor: 'pointer',
                        }}
                        title="Upload picture from your computer and insert into article body"
                      >
                        📁 Insert Image from Document
                      </button>
                      <button
                        type="button"
                        onClick={handleInsertBodyImageUrl}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          backgroundColor: '#EEF2FF',
                          color: '#4F46E5',
                          border: '1px solid #C7D2FE',
                          cursor: 'pointer',
                        }}
                        title="Insert image by external web URL"
                      >
                        🔗 Via URL
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="tw-form-textarea"
                    rows="7"
                    value={formData.body}
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    placeholder="Enter full article paragraphs, analysis, benchmarks... Markdown images supported: ![Caption](image-url)"
                    required
                  ></textarea>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748B',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}
                  >
                    💡 <strong>Tip:</strong> Upload visuals directly from your computer with <strong>📁 Insert Image from Document</strong> above, or embed using <code>![Caption](url)</code>.
                  </span>
                </div>

                <div className="tw-form-group">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <label className="tw-form-label" style={{ marginBottom: 0 }}>
                      Featured Image (Card & Header Banner)
                    </label>
                    <div
                      style={{
                        display: 'inline-flex',
                        backgroundColor: '#F1F5F9',
                        borderRadius: '6px',
                        padding: '2px',
                        gap: '2px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setFeaturedInputMode('file')}
                        style={{
                          border: 'none',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor:
                            featuredInputMode === 'file' ? '#FFFFFF' : 'transparent',
                          color:
                            featuredInputMode === 'file' ? '#0F172A' : '#64748B',
                          boxShadow:
                            featuredInputMode === 'file'
                              ? '0 1px 2px rgba(0,0,0,0.06)'
                              : 'none',
                        }}
                      >
                        📁 Upload from Device
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeaturedInputMode('url')}
                        style={{
                          border: 'none',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor:
                            featuredInputMode === 'url' ? '#FFFFFF' : 'transparent',
                          color:
                            featuredInputMode === 'url' ? '#0F172A' : '#64748B',
                          boxShadow:
                            featuredInputMode === 'url'
                              ? '0 1px 2px rgba(0,0,0,0.06)'
                              : 'none',
                        }}
                      >
                        🔗 Image URL
                      </button>
                    </div>
                  </div>

                  {/* Hidden file input for Featured Banner */}
                  <input
                    type="file"
                    ref={featuredFileInputRef}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={handleFeaturedFileSelect}
                  />

                  {featuredInputMode === 'file' ? (
                    formData.featuredImageUrl ? (
                      <div
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#0F172A',
                          height: '160px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src={formData.featuredImageUrl}
                          alt="Banner Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.15) 50%, rgba(15,23,42,0.4) 100%)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                          }}
                        >
                          <span
                            style={{
                              color: '#F8FAFC',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: 'rgba(0,0,0,0.4)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                            }}
                          >
                            ✓ Featured Banner Ready
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => featuredFileInputRef.current?.click()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                backgroundColor: '#FFFFFF',
                                color: '#0F172A',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                              }}
                            >
                              📁 Replace from Device
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  featuredImageUrl: '',
                                }))
                              }
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.95)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => featuredFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFeatured(true);
                        }}
                        onDragLeave={() => setIsDraggingFeatured(false)}
                        onDrop={handleFeaturedDrop}
                        style={{
                          border: isDraggingFeatured
                            ? '2px dashed #059669'
                            : '2px dashed #CBD5E1',
                          backgroundColor: isDraggingFeatured
                            ? '#ECFDF5'
                            : '#F8FAFC',
                          borderRadius: '8px',
                          padding: '1.75rem 1rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease-in-out',
                        }}
                      >
                        <div
                          style={{
                            color: '#059669',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          <UploadCloudIcon size={32} />
                        </div>
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: '#1E293B',
                            marginBottom: '0.25rem',
                          }}
                        >
                          Click to choose image from Windows Documents / File Manager
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          or drag and drop your image file here • Supports PNG, JPG, WebP, SVG
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
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
                        placeholder="/assets/blog_ai_gcc_dashboard.jpg or https://..."
                        style={{ flex: 1 }}
                      />
                      {formData.featuredImageUrl && (
                        <img
                          src={formData.featuredImageUrl}
                          alt="Banner Preview"
                          style={{
                            width: '54px',
                            height: '36px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid #CBD5E1',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748B',
                      marginTop: '0.3rem',
                      display: 'block',
                    }}
                  >
                    Main headline visual displayed on the Talent Advisory Insights carousel and article page banner.
                  </span>
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
