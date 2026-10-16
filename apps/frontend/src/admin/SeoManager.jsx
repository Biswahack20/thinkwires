import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';

const SeoManager = () => {
  const { showToast, activeRole } = useOutletContext();
  const [globalSeo, setGlobalSeo] = useState(null);
  const [pageSeo, setPageSeo] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Drawer / Modal
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    isIndexed: true,
  });

  const fetchSeo = () => {
    setLoading(true);
    adminApi
      .getSeoSettings()
      .then((res) => {
        setGlobalSeo(res.globalSeo || {});
        setPageSeo(res.pageSeo || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load SEO settings: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const openEditModal = (item) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit SEO settings.');
      return;
    }
    setEditingItem(item);
    setFormData({
      metaTitle: item.metaTitle || item.title || '',
      metaDescription: item.metaDescription || '',
      ogImage: item.ogImage || '/images/about-hero.jpg',
      isIndexed: item.isIndexed !== undefined ? item.isIndexed : true,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    adminApi
      .updateSeoSettings({
        pageId: editingItem.pageId,
        ...formData,
      })
      .then(() => {
        showToast(`SEO settings for /${editingItem.slug} persisted to MongoDB.`);
        setEditingItem(null);
        fetchSeo();
      })
      .catch((err) => showToast(`Save failed: ${err.message}`));
  };

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Search Engine Optimization & Metadata</h1>
          <p className="tw-view-subtitle">
            Manage Open Graph cards, canonical indexing directives, meta descriptions, and Google Search previews.
          </p>
        </div>
      </div>

      {/* Global Defaults Card */}
      {globalSeo && (
        <div className="tw-chart-card" style={{ marginBottom: '1.5rem' }}>
          <div className="tw-card-header">
            <div>
              <h2 className="tw-card-title">Global Canonical Domain Configuration</h2>
              <div className="tw-card-subtitle">Default fallback tags for social crawlers</div>
            </div>
            <span className="tw-badge deployed">Robots Indexing: ALLOWED</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', fontSize: '0.82rem' }}>
            <div>
              <div style={{ color: '#64748B' }}>Primary Site Name:</div>
              <strong style={{ color: '#172033' }}>{globalSeo.siteName}</strong>
            </div>
            <div>
              <div style={{ color: '#64748B' }}>Canonical Base URL:</div>
              <code>{globalSeo.canonicalBaseUrl}</code>
            </div>
          </div>
        </div>
      )}

      {/* Page SEO Table */}
      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <h2 className="tw-card-title">Page-Level Search Index Directives</h2>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Click edit to update meta title, Open Graph image, and search snippets
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Page / Route</th>
                <th>SEO Meta Title</th>
                <th>Meta Description Snippet</th>
                <th>OG Image</th>
                <th>Index Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                    Loading SEO parameters...
                  </td>
                </tr>
              ) : (
                pageSeo.map((item) => (
                  <tr key={item.pageId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <code style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                        /{item.slug}
                      </code>
                    </td>
                    <td>
                      <div style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {item.metaTitle}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.78rem', color: '#64748B' }}>
                        {item.metaDescription || <span style={{ color: '#94A3B8' }}>(Default site description)</span>}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', color: '#3478D4' }}>{item.ogImage}</span>
                    </td>
                    <td>
                      <span className={`tw-badge ${item.isIndexed ? 'published' : 'closed'}`}>
                        {item.isIndexed ? 'index, follow' : 'noindex'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="tw-btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        onClick={() => openEditModal(item)}
                      >
                        Edit SEO
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Edit Modal */}
      {editingItem && (
        <div className="tw-modal-overlay">
          <div className="tw-modal" style={{ maxWidth: '600px' }}>
            <div className="tw-modal-header">
              <h2 className="tw-modal-title">Edit SEO for /{editingItem.slug}</h2>
              <button className="tw-modal-close-btn" onClick={() => setEditingItem(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="tw-modal-body">
                {/* Google SERP Preview Card */}
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    marginBottom: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#202124', marginBottom: '0.15rem' }}>
                    https://thinkwires.com › {editingItem.slug}
                  </div>
                  <div style={{ fontSize: '1.1rem', color: '#1a0dab', fontWeight: 500, lineHeight: '1.3' }}>
                    {formData.metaTitle || editingItem.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4d5156', marginTop: '0.25rem', lineHeight: '1.4' }}>
                    {formData.metaDescription || 'Deploy pre-vetted engineers, specialized IT squads, and Employer of Record infrastructure with ThinkWires.'}
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">SEO Meta Title (Recommended &lt; 60 chars) *</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    required
                  />
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Length: {formData.metaTitle.length} characters
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Meta Description (Recommended 120-160 chars) *</label>
                  <textarea
                    className="tw-form-textarea"
                    rows="3"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Enter persuasive summary for Google and LinkedIn search previews..."
                  ></textarea>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Length: {formData.metaDescription.length} characters
                  </div>
                </div>

                <div className="tw-form-group">
                  <label className="tw-form-label">Social Share OG Image URL</label>
                  <input
                    type="text"
                    className="tw-form-input"
                    value={formData.ogImage}
                    onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                  />
                </div>

                <div className="tw-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                  <input
                    type="checkbox"
                    id="isIndexed"
                    checked={formData.isIndexed}
                    onChange={(e) => setFormData({ ...formData, isIndexed: e.target.checked })}
                  />
                  <label htmlFor="isIndexed" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#172033', cursor: 'pointer' }}>
                    Allow Search Engines to Index This Page (index, follow)
                  </label>
                </div>
              </div>

              <div className="tw-modal-footer">
                <button
                  type="button"
                  className="tw-btn-secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="tw-btn-primary">
                  Save SEO Directives
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoManager;
