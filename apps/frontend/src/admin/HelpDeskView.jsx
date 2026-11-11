import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  HelpDeskIcon,
  SearchIcon,
  RefreshIcon,
  CheckIcon,
  CloseIcon,
  AlertCircleIcon,
  ClockIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  UserIcon,
  EyeIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from './AdminIcons';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'General Inquiry', label: 'General Info' },
  { id: 'Talent Callback', label: 'Talent Callbacks' },
  { id: 'Enterprise Requisition', label: 'Requisitions' },
  { id: 'Workforce Consultation', label: 'Consultations' },
  { id: 'Bench Interview', label: 'Bench Interviews' },
  { id: 'Archived', label: 'Archived' },
];

const STATUS_OPTIONS = ['All', 'New', 'In Review', 'Replied', 'Archived'];

const HelpDeskView = () => {
  const { showToast, activeRole } = useOutletContext() || {
    showToast: (m) => console.log(m),
    activeRole: 'admin',
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Primary data states
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inReview: 0,
    replied: 0,
    infoInquiries: 0,
    hrInquiries: 0,
    routing: {
      overrideEmail: null,
      companyInfoEmail: 'info@thinkwires.com',
      hrRequisitionEmail: 'hr@thinkwires.com',
    },
  });
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || 'All'
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Drawer & Interactions
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Email Reply Form
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Internal Note Form
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Requisition Conversion
  const [converting, setConverting] = useState(false);

  const fetchStats = useCallback(() => {
    adminApi
      .getHelpDeskStats()
      .then((res) => {
        if (res && res.stats) {
          setStats(res.stats);
        }
      })
      .catch((err) => {
        console.warn('Could not load HelpDesk stats:', err.message);
      });
  }, []);

  const fetchTickets = useCallback(() => {
    setLoading(true);
    const params = {
      page,
      limit: 15,
      search,
    };

    if (activeCategory === 'Archived') {
      params.status = 'Archived';
    } else {
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }
      if (statusFilter !== 'All') {
        params.status = statusFilter;
      }
    }

    adminApi
      .getHelpDeskTickets(params)
      .then((res) => {
        setTickets(res.tickets || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load HelpDesk tickets: ${err.message}`);
      });
  }, [page, search, activeCategory, statusFilter, showToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleOpenTicket = (ticket) => {
    setDrawerLoading(true);
    setSelectedTicket(ticket);
    setReplySubject(
      ticket.subject.toLowerCase().startsWith('re:')
        ? ticket.subject
        : `Re: ${ticket.subject}`
    );
    setReplyMessage('');
    setNewNote('');

    const targetId = ticket._id || ticket.ticketId;
    adminApi
      .getHelpDeskTicketById(targetId)
      .then((res) => {
        if (res && res.ticket) {
          setSelectedTicket(res.ticket);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch full ticket details:', err.message);
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return;
    const targetId = selectedTicket._id || selectedTicket.ticketId;

    adminApi
      .updateHelpDeskTicket(targetId, { status: newStatus })
      .then((res) => {
        showToast(`Ticket status updated to "${newStatus}"`);
        if (res && res.ticket) {
          setSelectedTicket(res.ticket);
        } else {
          setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
        }
        fetchTickets();
        fetchStats();
      })
      .catch((err) => {
        showToast(`Status update failed: ${err.message}`);
      });
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedTicket) return;
    setSavingNote(true);

    const targetId = selectedTicket._id || selectedTicket.ticketId;
    adminApi
      .updateHelpDeskTicket(targetId, {
        internalNote: {
          note: newNote.trim(),
          author: activeRole === 'superadmin' ? 'SuperAdmin' : 'Recruitment Admin',
        },
      })
      .then((res) => {
        showToast('Internal note saved to ticket history');
        setNewNote('');
        if (res && res.ticket) {
          setSelectedTicket(res.ticket);
        }
        fetchTickets();
      })
      .catch((err) => {
        showToast(`Could not save note: ${err.message}`);
      })
      .finally(() => {
        setSavingNote(false);
      });
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    setSendingReply(true);

    const targetId = selectedTicket._id || selectedTicket.ticketId;
    adminApi
      .replyHelpDeskTicket(targetId, {
        replySubject: replySubject.trim() || `Re: ${selectedTicket.subject}`,
        replyMessage: replyMessage.trim(),
        repliedBy: activeRole === 'superadmin' ? 'Thinkwires SuperAdmin' : 'Thinkwires Support',
      })
      .then((res) => {
        showToast(`Reply dispatched via email to ${selectedTicket.email}`);
        setReplyMessage('');
        if (res && res.ticket) {
          setSelectedTicket(res.ticket);
        }
        fetchTickets();
        fetchStats();
      })
      .catch((err) => {
        showToast(`Email reply failed: ${err.message}`);
      })
      .finally(() => {
        setSendingReply(false);
      });
  };

  const handleConvertToRequisition = () => {
    if (!selectedTicket) return;
    setConverting(true);

    const targetId = selectedTicket._id || selectedTicket.ticketId;
    adminApi
      .convertHelpDeskToRequisition(targetId)
      .then((res) => {
        showToast(
          `Inquiry converted into Client Requisition mandate successfully!`
        );
        if (res && res.ticket) {
          setSelectedTicket(res.ticket);
        }
        fetchTickets();
        fetchStats();
      })
      .catch((err) => {
        showToast(`Requisition conversion failed: ${err.message}`);
      })
      .finally(() => {
        setConverting(false);
      });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return {
          backgroundColor: '#EDE9FE',
          color: '#7C3AED',
          border: '1px solid #DDD6FE',
        };
      case 'In Review':
        return {
          backgroundColor: '#FEF3C7',
          color: '#B45309',
          border: '1px solid #FDE68A',
        };
      case 'Replied':
        return {
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          border: '1px solid #BBF7D0',
        };
      case 'Archived':
      default:
        return {
          backgroundColor: '#F1F5F9',
          color: '#64748B',
          border: '1px solid #E2E8F0',
        };
    }
  };

  const isHrTicket = (ticket) => {
    const dest = ticket.destinationEmail || '';
    return (
      dest.includes('hr@') ||
      ticket.category === 'Enterprise Requisition' ||
      ticket.category === 'Talent Callback' ||
      ticket.category === 'Workforce Consultation' ||
      ticket.category === 'Bench Interview'
    );
  };

  return (
    <div>
      {/* View Header */}
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '0.25rem',
              flexWrap: 'wrap',
            }}
          >
            <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpDeskIcon size={24} />
              <span>HelpDesk & Inbound Communications</span>
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                backgroundColor: '#7C3AED',
                color: '#ffffff',
                padding: '0.15rem 0.6rem',
                borderRadius: '9999px',
                letterSpacing: '0.03em',
              }}
            >
              5-HOUR SLA ACTIVE
            </span>
          </div>
          <p className="tw-view-subtitle">
            Centralized desk tracking all public web inquiries, talent callbacks, service consultations, and enterprise requisitions.
          </p>

          {/* Global Email Routing Status Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginTop: '0.65rem',
              flexWrap: 'wrap',
            }}
          >
            {stats.routing?.overrideEmail && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #FCD34D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <AlertCircleIcon size={13} />
                <span>Override Active (Testing): {stats.routing.overrideEmail}</span>
              </span>
            )}
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <MailIcon size={13} />
              <span>General Info: {stats.routing?.companyInfoEmail || 'info@thinkwires.com'}</span>
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <MailIcon size={13} />
              <span>HR & Requisitions: {stats.routing?.hrRequisitionEmail || 'hr@thinkwires.com'}</span>
            </span>
          </div>
        </div>

        <button
          className="tw-btn-secondary"
          onClick={() => {
            fetchStats();
            fetchTickets();
            showToast('Refreshed HelpDesk communications');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <RefreshIcon size={15} />
          <span>Refresh Desk</span>
        </button>
      </div>

      {/* Metric Cards Ribbon */}
      <div className="tw-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-label">TOTAL COMMUNICATIONS</span>
            <div
              className="tw-kpi-icon-wrap"
              style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}
            >
              <HelpDeskIcon size={18} />
            </div>
          </div>
          <div className="tw-kpi-value">{stats.total || 0}</div>
          <div className="tw-kpi-caption">
            Inbound records captured across all website entry points
          </div>
        </div>

        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-label">NEW & UNANSWERED</span>
            <span className="tw-sla-pill urgent">5-Hour SLA</span>
          </div>
          <div className="tw-kpi-value" style={{ color: '#7C3AED' }}>
            {stats.new || 0}
          </div>
          <div className="tw-kpi-caption">
            Inbound inquiries pending response or recruiter triage
          </div>
        </div>

        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-label">GENERAL INQUIRIES</span>
            <div
              className="tw-kpi-icon-wrap"
              style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}
            >
              <MailIcon size={18} />
            </div>
          </div>
          <div className="tw-kpi-value" style={{ color: '#2563EB' }}>
            {stats.infoInquiries || 0}
          </div>
          <div className="tw-kpi-caption">
            Routed to {stats.routing?.companyInfoEmail || 'info@thinkwires.com'}
          </div>
        </div>

        <div className="tw-kpi-card">
          <div className="tw-kpi-header">
            <span className="tw-kpi-label">TALENT & REQUISITIONS</span>
            <div
              className="tw-kpi-icon-wrap"
              style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
            >
              <FileTextIcon size={18} />
            </div>
          </div>
          <div className="tw-kpi-value" style={{ color: '#16A34A' }}>
            {stats.hrInquiries || 0}
          </div>
          <div className="tw-kpi-caption">
            Routed to {stats.routing?.hrRequisitionEmail || 'hr@thinkwires.com'}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="tw-table-container">
        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            padding: '0 1rem',
            background: '#FAFBFD',
            gap: '0.5rem',
            overflowX: 'auto',
          }}
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setPage(1);
                  if (tab.id !== 'all') {
                    setSearchParams({ category: tab.id });
                  } else {
                    setSearchParams({});
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.85rem 0.95rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0F172A' : '#64748B',
                  borderBottom: isActive
                    ? '2.5px solid #7C3AED'
                    : '2.5px solid transparent',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar: Search & Filter */}
        <div
          className="tw-table-toolbar"
          style={{
            padding: '1rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: '1',
              minWidth: '260px',
              maxWidth: '460px',
            }}
          >
            <input
              type="text"
              placeholder="Search sender, email, company, subject, keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
                pointerEvents: 'none',
              }}
            >
              <SearchIcon size={15} />
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#64748B',
                whiteSpace: 'nowrap',
              }}
            >
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                background: '#ffffff',
                color: '#1E293B',
                fontWeight: 500,
                outline: 'none',
              }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Statuses' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="tw-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ticket ID & Priority
                </th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sender Contact
                </th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Category & Routing
                </th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Subject & Snippet
                </th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Received At
                </th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Status
                </th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    Loading communications desk...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: '#F1F5F9', marginBottom: '0.75rem' }}>
                      <HelpDeskIcon size={28} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '1rem', color: '#1E293B' }}>
                      No communications found
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
                      {search ? 'Try clearing your search query or filters.' : 'Inbound submissions will appear here in real time.'}
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => {
                  const isHr = isHrTicket(ticket);
                  return (
                    <tr
                      key={ticket._id || ticket.ticketId}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease',
                      }}
                      onClick={() => handleOpenTicket(ticket)}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1E293B' }}>
                          {ticket.ticketId}
                        </div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '0.2rem',
                            backgroundColor:
                              ticket.priority === 'Urgent'
                                ? '#FEE2E2'
                                : ticket.priority === 'High'
                                  ? '#FEF3C7'
                                  : '#F1F5F9',
                            color:
                              ticket.priority === 'Urgent'
                                ? '#DC2626'
                                : ticket.priority === 'High'
                                  ? '#D97706'
                                  : '#64748B',
                          }}
                        >
                          {ticket.priority || 'Normal'} Priority
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0F172A' }}>
                          {ticket.fullName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          {ticket.email}
                        </div>
                        {ticket.company && ticket.company !== 'Individual / Confidential' && (
                          <div style={{ fontSize: '0.74rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                            <BuildingIcon size={11} />
                            <span>{ticket.company}</span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1E293B' }}>
                          {ticket.category}
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            marginTop: '0.25rem',
                            backgroundColor: isHr ? '#DCFCE7' : '#EFF6FF',
                            color: isHr ? '#15803D' : '#1D4ED8',
                          }}
                        >
                          <MailIcon size={10} />
                          <span>{ticket.destinationEmail || (isHr ? 'hr@thinkwires.com' : 'info@thinkwires.com')}</span>
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', maxWidth: '300px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: '#1E293B',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ticket.subject}
                        </div>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: '#64748B',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '0.15rem',
                          }}
                        >
                          {ticket.message}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <ClockIcon size={12} />
                          <span>{formatDateTime(ticket.createdAt)}</span>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            display: 'inline-block',
                            ...getStatusBadgeStyle(ticket.status),
                          }}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTicket(ticket);
                          }}
                          className="tw-btn-secondary"
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.78rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <EyeIcon size={13} />
                          <span>View Desk</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div
          style={{
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #E2E8F0',
            background: '#FAFBFD',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Showing {tickets.length} of {totalCount} communications
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="tw-btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                opacity: page <= 1 ? 0.5 : 1,
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeftIcon size={14} />
              <span>Previous</span>
            </button>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', padding: '0 0.5rem' }}>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="tw-btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.78rem',
                opacity: page >= totalPages ? 0.5 : 1,
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Next</span>
              <ChevronRightIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Ticket Detail Drawer */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#ffffff',
              height: '100%',
              overflowY: 'auto',
              boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                background: '#FAFBFD',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7C3AED', backgroundColor: '#EDE9FE', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {selectedTicket.ticketId}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    {selectedTicket.category}
                  </span>
                </div>
                <h2 style={{ margin: '0.35rem 0 0.15rem 0', fontSize: '1.2rem', color: '#0F172A', fontWeight: 700 }}>
                  {selectedTicket.subject}
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Received {formatDateTime(selectedTicket.createdAt)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none',
                    ...getStatusBadgeStyle(selectedTicket.status),
                  }}
                >
                  <option value="New">Status: New</option>
                  <option value="In Review">Status: In Review</option>
                  <option value="Replied">Status: Replied</option>
                  <option value="Archived">Status: Archived</option>
                </select>

                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.35rem',
                    borderRadius: '6px',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              {/* Contact Information Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '1.15rem',
                  border: '1px solid #E2E8F0',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                  Sender Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Full Name</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <UserIcon size={14} />
                      <span>{selectedTicket.fullName}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Email Address</div>
                    <a
                      href={`mailto:${selectedTicket.email}`}
                      style={{
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        color: '#2563EB',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <MailIcon size={14} />
                      <span>{selectedTicket.email}</span>
                    </a>
                  </div>

                  {selectedTicket.phone && (
                    <div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Phone / Contact</div>
                      <a
                        href={`tel:${selectedTicket.phone}`}
                        style={{
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          color: '#2563EB',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <PhoneIcon size={14} />
                        <span>{selectedTicket.phone}</span>
                      </a>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Organization</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BuildingIcon size={14} />
                      <span>{selectedTicket.company || 'Confidential / Individual'}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Routing Destination</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MailIcon size={14} />
                      <span>{selectedTicket.destinationEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Inbound Message Body
                </div>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    color: '#1E293B',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedTicket.message}
                </div>
              </div>

              {/* Ingestion Metadata (e.g. Services, Roles, Headcount, Budget) */}
              {selectedTicket.metadata && Object.keys(selectedTicket.metadata).length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                    Submission Form Metadata
                  </div>
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '0.75rem',
                    }}
                  >
                    {Object.entries(selectedTicket.metadata).map(([k, v]) => {
                      if (!v || typeof v === 'object') return null;
                      return (
                        <div key={k}>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'capitalize' }}>
                            {k.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1E293B' }}>
                            {String(v)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 1-Click Requisition Conversion CTA */}
              <div
                style={{
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #DDD6FE',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#5B21B6' }}>
                    Enterprise Client Requisition Conversion
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6D28D9', marginTop: '0.2rem' }}>
                    Transform this inquiry into an active mandate in the recruitment pipeline with 1 click.
                  </div>
                </div>

                {selectedTicket.metadata?.convertedRequisitionId ? (
                  <button
                    onClick={() => navigate('/admin/requisitions')}
                    className="tw-btn-secondary"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#6D28D9',
                      borderColor: '#C4B5FD',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <CheckIcon size={14} />
                    <span>View Requisitions</span>
                  </button>
                ) : (
                  <button
                    disabled={converting}
                    onClick={handleConvertToRequisition}
                    className="tw-btn-primary"
                    style={{
                      backgroundColor: '#7C3AED',
                      borderColor: '#6D28D9',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <FileTextIcon size={14} />
                    <span>{converting ? 'Converting...' : 'Convert to Requisition'}</span>
                  </button>
                )}
              </div>

              {/* Email Reply Composer */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MailIcon size={15} />
                  <span>Send Direct Email Reply</span>
                </div>

                <form onSubmit={handleSendReply}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                      Subject Line:
                    </label>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                      Message Content:
                    </label>
                    <textarea
                      rows={4}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder={`Draft response to ${selectedTicket.fullName} (${selectedTicket.email})...`}
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="tw-btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.82rem',
                    }}
                  >
                    <MailIcon size={14} />
                    <span>{sendingReply ? 'Dispatching Email...' : 'Send Email Reply'}</span>
                  </button>
                </form>

                {/* Reply History */}
                {selectedTicket.replyHistory && selectedTicket.replyHistory.length > 0 && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem' }}>
                      Dispatched Replies ({selectedTicket.replyHistory.length})
                    </div>
                    {selectedTicket.replyHistory.map((rep, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: '#334155' }}>Replied by {rep.repliedBy || 'Admin'}</span>
                          <span>{formatDateTime(rep.sentAt)}</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#1E293B', whiteSpace: 'pre-wrap' }}>
                          {rep.replyContent}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Notes Thread */}
              <div
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                  Internal Recruiter Notes
                </div>

                <form onSubmit={handleAddNote} style={{ marginBottom: '1rem' }}>
                  <textarea
                    rows={2}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log private notes for recruitment & sales team..."
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      marginBottom: '0.5rem',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={savingNote || !newNote.trim()}
                    className="tw-btn-secondary"
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.35rem 0.75rem',
                    }}
                  >
                    <span>{savingNote ? 'Saving...' : 'Add Note'}</span>
                  </button>
                </form>

                {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedTicket.internalNotes.map((noteItem, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFBEB',
                          border: '1px solid #FDE68A',
                          borderRadius: '6px',
                          padding: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#92400E', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700 }}>{noteItem.author || 'Admin'}</span>
                          <span>{formatDateTime(noteItem.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#78350F' }}>
                          {noteItem.note}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontStyle: 'italic' }}>
                    No internal notes logged yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDeskView;

