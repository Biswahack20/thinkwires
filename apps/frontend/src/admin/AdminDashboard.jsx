import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { adminApi } from './adminService';
import {
  UsersIcon,
  HandshakeIcon,
  BuildingIcon,
  BriefcaseIcon,
  DollarIcon,
  TargetIcon,
  DashboardIcon,
  TrophyIcon,
  PlusIcon,
  EditIcon,
  BellIcon,
  RefreshIcon,
} from './AdminIcons';

const AdminDashboard = () => {
  const { showToast } = useOutletContext();
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchStats = (selectedPeriod) => {
    setLoading(true);
    adminApi
      .getDashboardStats(selectedPeriod)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
        setLoading(false);
        showToast(`Error: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    showToast(`Metrics filtered by ${newPeriod.toUpperCase()}`);
  };

  if (loading && !data) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        <strong>Loading operational dashboard...</strong>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const recentPlacements = data?.recentPlacements || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div>
      {/* Demo Notice Banner */}
      <div className="tw-demo-notice-banner">
        <div className="tw-demo-notice-content">
          <span className="tw-demo-pill">DEMO ENVIRONMENT</span>
          <span>
            {data?.demoNotice || 'Active DEMO dataset with dual-mode MongoDB persistence and simulated enterprise metrics.'}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>
          Storage: {data?.databaseMode || 'Dual-Mode Store'}
        </div>
      </div>

      {/* View Header with Title and Period Switcher */}
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Staffing & Manpower Operations</h1>
          <p className="tw-view-subtitle">
            Executive control panel for engineering deployments, client accounts, recruitment pipeline, and CMS.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="tw-period-filter-group">
            <button
              className={`tw-period-btn ${period === 'month' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('month')}
            >
              Month
            </button>
            <button
              className={`tw-period-btn ${period === 'quarter' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('quarter')}
            >
              Quarter
            </button>
            <button
              className={`tw-period-btn ${period === 'year' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('year')}
            >
              Year
            </button>
          </div>

          <button
            className="tw-btn-secondary"
            onClick={() => fetchStats(period)}
            title="Refresh metrics"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshIcon size={14} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="tw-kpi-grid">
        {/* 1. Total Employees */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Total Talent Pool</span>
            <div className="tw-kpi-icon-box emerald"><UsersIcon size={18} color="#008F68" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.totalEmployees || 10}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">+14%</span>
            <span>Pre-vetted engineers</span>
          </div>
        </div>

        {/* 2. Active Placements */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Active Deployments</span>
            <div className="tw-kpi-icon-box emerald"><HandshakeIcon size={18} color="#008F68" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.activePlacements || 4}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">100% On-Track</span>
            <span>Billable client contracts</span>
          </div>
        </div>

        {/* 3. Total Clients */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Corporate Clients</span>
            <div className="tw-kpi-icon-box blue"><BuildingIcon size={18} color="#2563EB" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.totalClients || 5}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">+2</span>
            <span>FinTech & HealthTech hubs</span>
          </div>
        </div>

        {/* 4. Open Requirements */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Open Requisitions</span>
            <div className="tw-kpi-icon-box amber"><BriefcaseIcon size={18} color="#D97706" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.openRequirements || 6}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge negative">Urgent</span>
            <span>Avg time-to-fill: 7 days</span>
          </div>
        </div>

        {/* 5. Period Revenue */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Billing Revenue ({period.toUpperCase()})</span>
            <div className="tw-kpi-icon-box emerald"><DollarIcon size={18} color="#008F68" /></div>
          </div>
          <div className="tw-kpi-value">
            ${(kpis.totalRevenue || 36200).toLocaleString()}
          </div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">+18.5%</span>
            <span>Margin: ${(kpis.grossMargin || 11584).toLocaleString()}</span>
          </div>
        </div>

        {/* 6. Candidate Pipeline */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Candidate Pipeline</span>
            <div className="tw-kpi-icon-box violet"><TargetIcon size={18} color="#7C3AED" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.candidatePipelineCount || 8}</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">Active ATS</span>
            <span>Across 6 pipeline stages</span>
          </div>
        </div>

        {/* 7. Recruitment Performance */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Recruitment SLA</span>
            <div className="tw-kpi-icon-box blue"><DashboardIcon size={18} color="#2563EB" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.recruitmentPerformance || 94.6}%</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">High Velocity</span>
            <span>Curated profiles in 5h</span>
          </div>
        </div>

        {/* 8. Fulfillment Rate */}
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-title">Fulfillment Ratio</span>
            <div className="tw-kpi-icon-box emerald"><TrophyIcon size={18} color="#008F68" /></div>
          </div>
          <div className="tw-kpi-value">{kpis.fulfillmentRate || 88.2}%</div>
          <div className="tw-kpi-footer">
            <span className="tw-trend-badge positive">SLA Compliant</span>
            <span>Zero compliance friction</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="tw-charts-grid">
        {/* Chart 1: Revenue vs Costs */}
        <div className="tw-chart-card">
          <div className="tw-card-header">
            <div>
              <h2 className="tw-card-title">Billing Revenue vs Operational Costs</h2>
              <div className="tw-card-subtitle">
                Financial performance breakdown for {period === 'month' ? 'the current month' : period === 'quarter' ? 'Q3-Q4 quarters' : 'the current fiscal year'}
              </div>
            </div>
            <span className="tw-badge deployed">Gross Margin ~32%</span>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueVsCosts || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008F68" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#008F68" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3478D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3478D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Gross Revenue ($)"
                  stroke="#008F68"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  name="Direct Costs ($)"
                  stroke="#3478D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCost)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Actual Placements vs Targets */}
        <div className="tw-chart-card">
          <div className="tw-card-header">
            <div>
              <h2 className="tw-card-title">Placements vs Targets</h2>
              <div className="tw-card-subtitle">Quarterly delivery targets</div>
            </div>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.placementsVsTargets || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="actual" name="Actual Hired" fill="#008F68" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Quota" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3 & Quick Actions */}
      <div className="tw-charts-grid" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
        {/* Quick Actions Panel */}
        <div className="tw-chart-card">
          <div className="tw-card-header">
            <div>
              <h2 className="tw-card-title">Quick Actions</h2>
              <div className="tw-card-subtitle">Frequent administrative operations</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/employees" className="tw-btn-primary" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <PlusIcon size={15} />
              <span>Onboard New Employee</span>
            </Link>
            <Link to="/admin/jobs" className="tw-btn-secondary" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <BriefcaseIcon size={15} />
              <span>Post Staffing Requirement</span>
            </Link>
            <Link to="/admin/candidates" className="tw-btn-secondary" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <TargetIcon size={15} />
              <span>Review Candidate Pipeline</span>
            </Link>
            <Link to="/admin/cms/blog" className="tw-btn-secondary" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <EditIcon size={15} />
              <span>Draft New CMS Article</span>
            </Link>
            <Link to="/admin/cms/announcements" className="tw-btn-secondary" style={{ justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <BellIcon size={15} />
              <span>Broadcast Announcement</span>
            </Link>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              fontSize: '0.78rem',
              border: '1px solid #E2E8F0',
            }}
          >
            <strong>Role Permissions:</strong>
            <div style={{ marginTop: '0.25rem', color: '#64748B', lineHeight: '1.4' }}>
              Admin has full read-write access. Use the top persona switcher to test Editor and Viewer restrictions.
            </div>
          </div>
        </div>

        {/* Chart 3: Recruitment Performance Trends */}
        <div className="tw-chart-card">
          <div className="tw-card-header">
            <div>
              <h2 className="tw-card-title">Recruitment Performance & SLA Trends</h2>
              <div className="tw-card-subtitle">Speed of delivery vs client satisfaction index</div>
            </div>
            <span className="tw-badge available">Top 1% Efficiency</span>
          </div>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.performanceTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} domain={[70, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="velocity"
                  name="Sourcing Velocity (%)"
                  stroke="#3478D4"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  name="Client Satisfaction (%)"
                  stroke="#008F68"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Bottom Section: Active Placements & Activity Stream */}
      <div className="tw-bottom-grid">
        {/* Active Placements Table */}
        <div className="tw-table-container">
          <div className="tw-table-toolbar">
            <h2 className="tw-card-title">Recent Billable Placements</h2>
            <Link to="/admin/placements" className="tw-btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
              View All Deployments →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="tw-table">
              <thead>
                <tr>
                  <th>Talent Name</th>
                  <th>Client</th>
                  <th>Role</th>
                  <th>Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPlacements.map((plc) => (
                  <tr key={plc.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{plc.candidateOrEmployeeName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{plc.personType}</div>
                    </td>
                    <td>{plc.clientName}</td>
                    <td>{plc.jobTitle}</td>
                    <td>
                      <strong>${Number(plc.billingRate).toLocaleString()}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>/mo</span>
                    </td>
                    <td>
                      <span className={`tw-badge ${plc.assignmentStatus.toLowerCase()}`}>
                        {plc.assignmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Business Activity */}
        <div className="tw-chart-card">
          <div className="tw-card-header">
            <div>
              <h2 className="tw-card-title">Operational Audit Log</h2>
              <div className="tw-card-subtitle">Live system activity stream</div>
            </div>
          </div>

          <div className="tw-activity-list">
            {recentActivity.map((act) => (
              <div key={act.id || act._id} className="tw-activity-item">
                <span
                  className="tw-activity-bullet"
                  style={{ backgroundColor: act.badgeColor || '#008F68' }}
                ></span>
                <div className="tw-activity-content">
                  <div className="tw-activity-title">{act.action}</div>
                  <div className="tw-activity-desc">{act.description}</div>
                  <div className="tw-activity-time">
                    {act.user?.name} ({act.user?.role}) •{' '}
                    {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
