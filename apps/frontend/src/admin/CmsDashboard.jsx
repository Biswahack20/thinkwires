import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  FileTextIcon,
  EditIcon,
  ImageIcon,
  BellIcon,
  SearchIcon,
} from './AdminIcons';

const CmsDashboard = () => {
  const { showToast } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getCmsStats()
      .then((res) => {
        setStats(res);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`CMS Stats error: ${err.message}`);
      });
  }, []);

  if (loading && !stats) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        Loading CMS workspace...
      </div>
    );
  }

  const s = stats?.stats || {};
  const recentUpdates = stats?.recentUpdates || [];

  return (
    <div>
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Content Management System (CMS)</h1>
          <p className="tw-view-subtitle">
            Publish and maintain ThinkWires public website pages, editorial
            thought leadership articles, media assets, and corporate
            announcements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/cms/pages" className="tw-btn-secondary">
            Manage Pages
          </Link>
          <Link
            to="/admin/cms/blog"
            className="tw-btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <EditIcon size={15} />
            <span>New Blog Post</span>
          </Link>
        </div>
      </div>

      {/* CMS Stat Cards */}
      <div className="tw-kpi-grid">
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Website Pages</span>
            <div className="tw-kpi-icon-box emerald">
              <FileTextIcon size={18} color="#008F68" />
            </div>
          </div>
          <div className="tw-kpi-value">{s.totalPages || 6}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">
              {s.publishedPages || 6} Published
            </span>
            <span>{s.draftPages || 0} Drafts</span>
          </div>
        </div>

        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Blog & Articles</span>
            <div className="tw-kpi-icon-box violet">
              <EditIcon size={18} color="#7C3AED" />
            </div>
          </div>
          <div className="tw-kpi-value">{s.totalArticles || 4}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">
              {s.publishedArticles || 3} Live
            </span>
            <span>{s.draftArticles || 1} In Draft</span>
          </div>
        </div>

        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Media Library Assets</span>
            <div className="tw-kpi-icon-box blue">
              <ImageIcon size={18} color="#2563EB" />
            </div>
          </div>
          <div className="tw-kpi-value">{s.totalMedia || 4}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">Modular Storage</span>
            <span>Images & logos</span>
          </div>
        </div>

        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Live Announcements</span>
            <div className="tw-kpi-icon-box amber">
              <BellIcon size={18} color="#D97706" />
            </div>
          </div>
          <div className="tw-kpi-value">{s.totalAnnouncements || 3}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">Active</span>
            <span>Client & Staff portals</span>
          </div>
        </div>
      </div>

      {/* CMS Module Quick Launch Tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <Link
          to="/admin/cms/pages"
          className="tw-chart-card"
          style={{ textDecoration: 'none', transition: 'all 0.15s ease' }}
        >
          <div style={{ marginBottom: '0.6rem', color: '#008F68' }}>
            <FileTextIcon size={24} />
          </div>
          <strong style={{ color: '#172033', fontSize: '0.95rem' }}>
            Website Pages
          </strong>
          <p
            style={{
              color: '#64748B',
              fontSize: '0.78rem',
              margin: '0.3rem 0 0 0',
            }}
          >
            Edit Home, About Us, Services, Careers, Contact, and Privacy Policy.
          </p>
        </Link>

        <Link
          to="/admin/cms/blog"
          className="tw-chart-card"
          style={{ textDecoration: 'none', transition: 'all 0.15s ease' }}
        >
          <div style={{ marginBottom: '0.6rem', color: '#7C3AED' }}>
            <EditIcon size={24} />
          </div>
          <strong style={{ color: '#172033', fontSize: '0.95rem' }}>
            Blog & News
          </strong>
          <p
            style={{
              color: '#64748B',
              fontSize: '0.78rem',
              margin: '0.3rem 0 0 0',
            }}
          >
            Author articles, manage slugs, categories, tags, and publication
            schedules.
          </p>
        </Link>

        <Link
          to="/admin/cms/media"
          className="tw-chart-card"
          style={{ textDecoration: 'none', transition: 'all 0.15s ease' }}
        >
          <div style={{ marginBottom: '0.6rem', color: '#2563EB' }}>
            <ImageIcon size={24} />
          </div>
          <strong style={{ color: '#172033', fontSize: '0.95rem' }}>
            Media Library
          </strong>
          <p
            style={{
              color: '#64748B',
              fontSize: '0.78rem',
              margin: '0.3rem 0 0 0',
            }}
          >
            Organize branding assets, thumbnails, hero banners, and vector
            graphics.
          </p>
        </Link>

        <Link
          to="/admin/cms/seo"
          className="tw-chart-card"
          style={{ textDecoration: 'none', transition: 'all 0.15s ease' }}
        >
          <div style={{ marginBottom: '0.6rem', color: '#0284C7' }}>
            <SearchIcon size={24} />
          </div>
          <strong style={{ color: '#172033', fontSize: '0.95rem' }}>
            SEO & Meta Settings
          </strong>
          <p
            style={{
              color: '#64748B',
              fontSize: '0.78rem',
              margin: '0.3rem 0 0 0',
            }}
          >
            Manage page titles, open graph images, canonical URLs, and meta
            descriptions.
          </p>
        </Link>
      </div>

      {/* Recent Content Modifications */}
      <div className="tw-table-container">
        <div className="tw-table-toolbar">
          <h2 className="tw-card-title">Recent Content Modifications</h2>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Calculated directly from MongoDB records
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table">
            <thead>
              <tr>
                <th>Title & URL Slug</th>
                <th>Content Type</th>
                <th>Status</th>
                <th>Last Editor</th>
                <th>Updated Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentUpdates.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      /{item.slug}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                      }}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <span className={`tw-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.lastUpdatedBy}</td>
                  <td>{new Date(item.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CmsDashboard;
