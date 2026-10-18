import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { adminApi, getAdminRole, setAdminRole } from './adminService';
import {
  DashboardIcon,
  UsersIcon,
  TargetIcon,
  BuildingIcon,
  BriefcaseIcon,
  HandshakeIcon,
  MonitorIcon,
  FileTextIcon,
  EditIcon,
  ImageIcon,
  SearchIcon,
  BellIcon,
  LayersIcon,
  ShieldIcon,
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from './AdminIcons';
import './admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(getAdminRole());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [dbStatus, setDbStatus] = useState('In-Memory Resilient Demo');
  const [isMongo, setIsMongo] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load announcements & db status for notifications based on active role
  useEffect(() => {
    const fetchMeta = activeRole === 'cms_admin' ? adminApi.getCmsStats() : adminApi.getDashboardStats();
    fetchMeta
      .then((data) => {
        if (data && data.announcements) setAnnouncements(data.announcements);
        if (data && data.databaseMode) setDbStatus(data.databaseMode);
        if (data && data.isMongoActive !== undefined) setIsMongo(data.isMongoActive);
      })
      .catch((err) => console.warn('Could not fetch topbar stats:', err.message));
  }, [activeRole]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setActiveRole(newRole);
    setAdminRole(newRole);
    showToast(`Switched active persona to ${newRole.toUpperCase()}`);

    // Seamless navigation if the current path is forbidden for the newly selected role
    if (newRole === 'cms_admin' && !location.pathname.startsWith('/admin/cms')) {
      navigate('/admin/cms');
    } else if (newRole === 'admin' && location.pathname.startsWith('/admin/cms')) {
      navigate('/admin');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isNavActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  // RBAC Permission checks:
  // - SuperAdmin: Complete control (Overview, Manpower & Recruitment, and CMS)
  // - cms_admin: ONLY control to CMS
  // - Admin: ONLY control to Manpower and Recruitment
  const isSuperAdmin = activeRole === 'superadmin';
  const isCmsAdmin = activeRole === 'cms_admin';
  const isAdmin = activeRole === 'admin';

  // Route categorization
  const isCmsRoute = location.pathname.startsWith('/admin/cms');
  const isSystemMembersRoute = location.pathname.startsWith('/admin/system-members');
  const isManpowerRoute = !isCmsRoute && !isSystemMembersRoute;

  // Restriction checks:
  // - cms_admin is strictly blocked from Manpower, Overview, and System Members routes
  // - admin is strictly blocked from CMS and System Members routes
  // - only superadmin can access system members
  const isCmsAdminBlocked = isCmsAdmin && (isManpowerRoute || isSystemMembersRoute);
  const isAdminCmsBlocked = isAdmin && isCmsRoute;
  const isSystemMembersBlocked = !isSuperAdmin && isSystemMembersRoute;
  const isRestrictedForCurrentRole = isCmsAdminBlocked || isAdminCmsBlocked || isSystemMembersBlocked;

  // Navigation Items dynamic based on RBAC Role:
  // Only assigned pages are visible to respective roles!
  const navItems = [
    // 1. Overview & Manpower (Visible ONLY to SuperAdmin and Admin)
    ...((isSuperAdmin || isAdmin)
      ? [
          {
            group: 'OVERVIEW',
            items: [{ label: 'Dashboard Overview', path: '/admin', icon: <DashboardIcon size={18} /> }],
          },
          {
            group: 'MANPOWER & RECRUITMENT',
            items: [
              { label: 'Employees', path: '/admin/employees', icon: <UsersIcon size={18} /> },
              { label: 'Candidates & Pipeline', path: '/admin/candidates', icon: <TargetIcon size={18} />, badge: '8' },
              { label: 'Clients', path: '/admin/clients', icon: <BuildingIcon size={18} /> },
              { label: 'Job Requirements', path: '/admin/jobs', icon: <BriefcaseIcon size={18} />, badge: 'Urgent' },
              { label: 'Placements', path: '/admin/placements', icon: <HandshakeIcon size={18} /> },
            ],
          },
        ]
      : []),

    // 2. Content Management System (Visible ONLY to SuperAdmin and CMS Admin)
    ...((isSuperAdmin || isCmsAdmin)
      ? [
          {
            group: 'CONTENT MANAGEMENT (CMS)',
            items: [
              { label: 'CMS Overview', path: '/admin/cms', icon: <MonitorIcon size={18} /> },
              { label: 'Website Pages', path: '/admin/cms/pages', icon: <FileTextIcon size={18} /> },
              { label: 'Blog & Articles', path: '/admin/cms/blog', icon: <EditIcon size={18} /> },
              { label: 'Media Library', path: '/admin/cms/media', icon: <ImageIcon size={18} /> },
              { label: 'SEO Settings', path: '/admin/cms/seo', icon: <SearchIcon size={18} /> },
              { label: 'Announcements', path: '/admin/cms/announcements', icon: <BellIcon size={18} /> },
              { label: 'Tech Stack Catalog', path: '/admin/cms/tech-stack', icon: <LayersIcon size={18} /> },
            ],
          },
        ]
      : []),

    // 3. System Governance & RBAC (Visible ONLY to SuperAdmin)
    ...(isSuperAdmin
      ? [
          {
            group: 'SYSTEM GOVERNANCE',
            items: [
              { label: 'System Members', path: '/admin/system-members', icon: <ShieldIcon size={18} />, badge: 'Superadmin' },
            ],
          },
        ]
      : []),
  ];

  // User Profile metadata based on active persona
  const getUserProfile = () => {
    switch (activeRole) {
      case 'superadmin':
        return {
          initials: 'AV',
          name: 'Alexander Vance',
          roleLabel: 'SUPERADMIN',
          badgeColor: 'linear-gradient(135deg, #10B981, #059669)',
          badgeText: '#FFFFFF',
          scope: 'Complete Control',
        };
      case 'cms_admin':
        return {
          initials: 'ER',
          name: 'Elena Rostova',
          roleLabel: 'CMS ADMIN',
          badgeColor: '#6366F1',
          badgeText: '#FFFFFF',
          scope: 'CMS Control Only',
        };
      case 'admin':
      default:
        return {
          initials: 'BS',
          name: 'Biswarupa Swain',
          roleLabel: 'ADMIN',
          badgeColor: '#3B82F6',
          badgeText: '#FFFFFF',
          scope: 'Manpower & Recruitment Only',
        };
    }
  };

  const currentProfile = getUserProfile();

  return (
    <div className="tw-admin-wrapper">
      {/* Sidebar */}
      <aside className={`tw-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="tw-sidebar-header">
          <Link to={isCmsAdmin ? '/admin/cms' : '/admin'} className="tw-brand">
            <span className="tw-brand-dot"></span>
            {!collapsed && (
              <>
                <span className="tw-brand-text-emerald">Think</span>
                <span className="tw-brand-text-dark">Wires</span>
                <span
                  className="tw-brand-badge"
                  style={{
                    background: currentProfile.badgeColor,
                    color: currentProfile.badgeText,
                    fontSize: '0.62rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  {currentProfile.roleLabel}
                </span>
              </>
            )}
          </Link>
          <button
            className="tw-sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title="Toggle Sidebar"
          >
            {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
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
              <MenuIcon size={18} />
            </button>
            <div className="tw-global-search">
              <span className="tw-search-icon">
                <SearchIcon size={15} color="#94A3B8" />
              </span>
              <input
                type="text"
                placeholder={
                  isCmsAdmin
                    ? 'Search website pages, articles, or media...'
                    : isAdmin
                    ? 'Search employees, requisitions, candidates, or clients...'
                    : 'Search across entire enterprise (workforce, CMS, candidates)...'
                }
              />
            </div>
          </div>

          <div className="tw-topbar-right">
            {/* Live Role Switcher (SuperAdmin, CMS Admin, Admin) */}
            <div className="tw-role-selector-wrapper" title="Switch between RBAC Personas to test security permissions">
              <span className="tw-role-label">Persona:</span>
              <select className="tw-role-select" value={activeRole} onChange={handleRoleChange}>
                <option value="superadmin">SuperAdmin (Complete Control)</option>
                <option value="cms_admin">CMS Admin (CMS Only)</option>
                <option value="admin">Admin (Manpower & Recruitment)</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                className="tw-topbar-action-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="View Announcements & Notifications"
              >
                <BellIcon size={17} color="#475569" />
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
              <div
                className="tw-avatar"
                style={{
                  background: currentProfile.badgeColor,
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                }}
              >
                {currentProfile.initials}
              </div>
              <div className="tw-user-info">
                <span className="tw-user-name">{currentProfile.name}</span>
                <span
                  className="tw-user-role-badge"
                  style={{
                    background: currentProfile.badgeColor,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                  }}
                >
                  {currentProfile.roleLabel}
                </span>
              </div>
            </div>

            {/* Back to Public Site */}
            <Link to="/" className="tw-exit-link" title="Return to public ThinkWires website">
              <span>Public Site</span>
              <ExternalLinkIcon size={12} style={{ marginLeft: '5px' }} />
            </Link>
          </div>
        </header>

        {/* Content Body with RBAC Route Guard */}
        <main className="tw-content-area">
          {isRestrictedForCurrentRole ? (
            <div
              style={{
                padding: '3.5rem 2.5rem',
                textAlign: 'center',
                maxWidth: '680px',
                margin: '3rem auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                <ShieldIcon size={48} color={isSystemMembersBlocked ? '#DC2626' : isCmsAdminBlocked ? '#4F46E5' : '#2563EB'} />
              </div>

              <div
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  marginBottom: '1rem',
                  background: isSystemMembersBlocked ? '#FEF2F2' : isCmsAdminBlocked ? '#EEF2FF' : '#EFF6FF',
                  color: isSystemMembersBlocked ? '#DC2626' : isCmsAdminBlocked ? '#4F46E5' : '#1D4ED8',
                  border: isSystemMembersBlocked ? '1px solid #FECACA' : isCmsAdminBlocked ? '1px solid #C7D2FE' : '1px solid #BFDBFE',
                }}
              >
                {isSystemMembersBlocked
                  ? 'SUPERADMIN PRIVILEGE REQUIRED'
                  : isCmsAdminBlocked
                  ? 'CMS ADMIN SCOPE RESTRICTION'
                  : 'ADMIN SCOPE RESTRICTION'}
              </div>

              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                {isSystemMembersBlocked
                  ? 'Access Restricted to Superadmin'
                  : isCmsAdminBlocked
                  ? 'Access Restricted to Content Management System (CMS)'
                  : 'Access Restricted to Manpower & Recruitment'}
              </h2>

              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.65', marginBottom: '2rem' }}>
                {isSystemMembersBlocked ? (
                  <>
                    Your current account is authenticated as <strong>{activeRole.toUpperCase()}</strong>.
                    <br /><br />
                    System Members, official email accounts, RBAC role assignments, and authentication passwords can <strong>only be added and edited by the Superadmin</strong>.
                  </>
                ) : isCmsAdminBlocked ? (
                  <>
                    Your current account is authenticated as <strong>CMS Administrator</strong> (<code>cmsadmin@thinkwires.com</code>).
                    <br /><br />
                    Per company authorization policy, CMS Administrators have control restricted exclusively to the <strong>Content Management System (CMS)</strong>.
                    Workforce employees, candidates, clients, job requisitions, and placement rosters require <strong>SuperAdmin</strong> or <strong>Admin</strong> credentials.
                  </>
                ) : (
                  <>
                    Your current account is authenticated as <strong>Admin</strong> (<code>admin@thinkwires.com</code>).
                    <br /><br />
                    Per company authorization policy, Admins have control restricted exclusively to <strong>Manpower and Recruitment</strong>.
                    The Content Management System (CMS), page editing, blog publishing, and SEO configurations require <strong>SuperAdmin</strong> or <strong>CMS Admin</strong> credentials.
                  </>
                )}
              </p>

              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {isSystemMembersBlocked ? (
                  <Link
                    to={isCmsAdmin ? '/admin/cms' : '/admin'}
                    className="tw-btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {isCmsAdmin ? <MonitorIcon size={16} /> : <UsersIcon size={16} />}
                    <span>{isCmsAdmin ? 'Return to CMS Workspace' : 'Return to Manpower Workspace'}</span>
                  </Link>
                ) : isCmsAdminBlocked ? (
                  <Link
                    to="/admin/cms"
                    className="tw-btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <MonitorIcon size={16} />
                    <span>Go to Assigned CMS Workspace</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin"
                    className="tw-btn-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <UsersIcon size={16} />
                    <span>Go to Assigned Manpower & Recruitment</span>
                  </Link>
                )}
                <button
                  type="button"
                  className="tw-btn-secondary"
                  onClick={() => {
                    setActiveRole('superadmin');
                    setAdminRole('superadmin');
                    showToast('Switched to SuperAdmin Persona (Complete Control)');
                  }}
                >
                  Switch to SuperAdmin Persona
                </button>
              </div>
            </div>
          ) : (
            <Outlet context={{ showToast, activeRole }} />
          )}
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="tw-toast">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
