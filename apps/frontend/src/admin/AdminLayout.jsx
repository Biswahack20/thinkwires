import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { adminApi, getAdminRole, setAdminRole } from './adminService';
import './admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(getAdminRole());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [dbStatus, setDbStatus] = useState('In-Memory Resilient Demo');
  const [isMongo, setIsMongo] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load announcements & db status for notifications
  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((data) => {
        if (data && data.announcements) setAnnouncements(data.announcements);
        if (data && data.databaseMode) setDbStatus(data.databaseMode);
        if (data && data.isMongoActive) setIsMongo(data.isMongoActive);
      })
      .catch((err) => console.warn('Could not fetch topbar stats:', err.message));
  }, []);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setActiveRole(newRole);
    setAdminRole(newRole);
    showToast(`Switched active persona to ${newRole.toUpperCase()}`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isNavActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Dashboard Overview', path: '/admin', icon: '📊' },
      ],
    },
    {
      group: 'MANPOWER & RECRUITMENT',
      items: [
        { label: 'Employees', path: '/admin/employees', icon: '👥' },
        { label: 'Candidates & Pipeline', path: '/admin/candidates', icon: '🎯', badge: '8' },
        { label: 'Clients', path: '/admin/clients', icon: '🏢' },
        { label: 'Job Requirements', path: '/admin/jobs', icon: '📋', badge: 'Urgent' },
        { label: 'Placements', path: '/admin/placements', icon: '🤝' },
      ],
    },
    {
      group: 'CONTENT MANAGEMENT (CMS)',
      items: [
        { label: 'CMS Overview', path: '/admin/cms', icon: '🖥️' },
        { label: 'Website Pages', path: '/admin/cms/pages', icon: '📄' },
        { label: 'Blog & Articles', path: '/admin/cms/blog', icon: '✍️' },
        { label: 'Media Library', path: '/admin/cms/media', icon: '🖼️' },
        { label: 'SEO Settings', path: '/admin/cms/seo', icon: '🔍' },
        { label: 'Announcements', path: '/admin/cms/announcements', icon: '📢' },
      ],
    },
  ];

  return (
    <div className="tw-admin-wrapper">
      {/* Sidebar */}
      <aside className={`tw-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="tw-sidebar-header">
          <Link to="/admin" className="tw-brand">
            <span className="tw-brand-dot"></span>
            {!collapsed && (
              <>
                <span className="tw-brand-text-emerald">Think</span>
                <span className="tw-brand-text-dark">Wires</span>
                <span className="tw-brand-badge">ADMIN</span>
              </>
            )}
          </Link>
          <button
            className="tw-sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title="Toggle Sidebar"
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Navigation list */}
        {navItems.map((grp) => (
          <div key={grp.group} className="tw-nav-group">
            {!collapsed && <div className="tw-nav-group-title">{grp.group}</div>}
            <ul className="tw-nav-list">
              {grp.items.map((item) => (
                <li
                  key={item.path}
                  className={`tw-nav-item ${isNavActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Link to={item.path} title={item.label}>
                    <span className="tw-nav-icon">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="tw-nav-badge">{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Sidebar Footer with Live Status */}
        <div className="tw-sidebar-footer">
          <div className="tw-db-status-pill" title={`Data Layer: ${dbStatus}`}>
            <span className={`tw-status-dot ${isMongo ? 'online' : 'demo'}`}></span>
            {!collapsed && (
              <span style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isMongo ? 'MongoDB Active' : 'Dual-Mode Demo'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className={`tw-main-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Topbar */}
        <header className="tw-topbar">
          <div className="tw-topbar-left">
            <button
              className="tw-mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              title="Open Navigation Menu"
            >
              ☰
            </button>
            <div className="tw-global-search">
              <span className="tw-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search employees, requisitions, candidates, or pages..."
              />
            </div>
          </div>

          <div className="tw-topbar-right">
            {/* Live Role Switcher (Admin / Editor / Viewer) */}
            <div className="tw-role-selector-wrapper" title="Switch between Demo Personas to test backend role permissions">
              <span className="tw-role-label">Persona:</span>
              <select className="tw-role-select" value={activeRole} onChange={handleRoleChange}>
                <option value="admin">Admin (Full Control)</option>
                <option value="editor">Editor (Content & Requisitions)</option>
                <option value="viewer">Viewer (Read-Only Auditor)</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="tw-topbar-action-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="View Announcements & Notifications"
              >
                🔔
                {announcements.length > 0 && (
                  <span className="tw-badge-count">{announcements.length}</span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    zIndex: 110,
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Announcements</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{announcements.length} active</span>
                  </div>
                  {announcements.map((a, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.5rem 0',
                        borderBottom: idx < announcements.length - 1 ? '1px solid #F1F5F9' : 'none',
                        fontSize: '0.78rem',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#172033', marginBottom: '0.15rem' }}>{a.title}</div>
                      <div style={{ color: '#64748B', fontSize: '0.73rem', lineHeight: '1.3' }}>{a.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="tw-user-profile">
              <div className="tw-avatar">
                {activeRole === 'admin' ? 'BS' : activeRole === 'editor' ? 'SJ' : 'DT'}
              </div>
              <div className="tw-user-info">
                <span className="tw-user-name">
                  {activeRole === 'admin' ? 'Biswarupa Swain' : activeRole === 'editor' ? 'Sarah Jenkins' : 'David Thorne'}
                </span>
                <span className="tw-user-role-badge">{activeRole}</span>
              </div>
            </div>

            {/* Back to Public Site */}
            <Link to="/" className="tw-exit-link" title="Return to public ThinkWires website">
              <span>Public Site</span> ↗
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="tw-content-area">
          <Outlet context={{ showToast, activeRole }} />
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="tw-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
