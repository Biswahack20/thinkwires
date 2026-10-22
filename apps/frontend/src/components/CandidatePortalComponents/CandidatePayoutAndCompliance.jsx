import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitCandidateTimesheet,
  resetTimesheetState,
} from '../../store/slices/candidatePortalSlice';
import { CloseIcon } from '../../admin/AdminIcons';

const CandidatePayoutAndCompliance = ({ data = {} }) => {
  const dispatch = useDispatch();
  const { timesheetStatus, timesheetSuccess } = useSelector(
    (state) => state.candidatePortal || {}
  );
  const { activePlacement = {}, escrow = {}, complianceVault = [] } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hours, setHours] = useState('40');
  const [comments, setComments] = useState('');

  const handleTimesheetSubmit = (e) => {
    e.preventDefault();
    dispatch(
      submitCandidateTimesheet({
        hours,
        weekEnding: new Date().toLocaleDateString(),
        comments,
      })
    );
  };

  return (
    <div className="CandidatePortal-cardSection">
      <div className="section-header-bar">
        <div>
          <div className="title-with-icon">
            <span className="material-symbols-outlined header-icon">
              account_balance
            </span>
            <h2 className="section-main-title">
              Timesheet, Payouts &amp; EOR Compliance
            </h2>
          </div>
          <p className="section-subtext">
            Governed by ThinkWires Global Employer of Record &amp;
            Multi-Currency Escrow Facility.
          </p>
        </div>

        <div className="action-buttons-group">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-submit-timesheet"
          >
            <span className="material-symbols-outlined">more_time</span>
            <span>Submit Weekly Timesheet</span>
          </button>
          <button type="button" className="btn-payslip">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Download Payslip PDF</span>
          </button>
        </div>
      </div>

      {timesheetSuccess && (
        <div className="timesheet-success-alert">
          ✓ Weekly timesheet of {hours} hours has been transmitted to client
          manager for auto-approval.
        </div>
      )}

      {/* 3 Grid Cards */}
      <div className="CandidatePortal-triGrid">
        {/* Card 1: Active Placement */}
        <div className="governance-card">
          <div className="gov-top">
            <span className="gov-label">Active Placement</span>
            <span className="gov-pill success">Logged</span>
          </div>
          <div className="gov-mid">
            <h3 className="client-name">
              {activePlacement.client || 'Vantage Cloud Systems'}
            </h3>
            <span className="contract-type">
              {activePlacement.contract ||
                'On-demand Staff Augmentation Pod (Tier-1)'}
            </span>
          </div>
          <div className="gov-stat-box">
            <div>
              <span className="stat-sub">Current Week</span>
              <span className="stat-hours">
                {activePlacement.hours || '38.5 / 40.0 hrs'}
              </span>
            </div>
            <span className="status-approved">
              <span className="material-symbols-outlined check-icon">
                check_circle
              </span>
              <span>Approved</span>
            </span>
          </div>
        </div>

        {/* Card 2: Escrow Payout */}
        <div className="governance-card">
          <div className="gov-top">
            <span className="gov-label">Pending Monthly Escrow</span>
            <span className="material-symbols-outlined gov-icon">schedule</span>
          </div>
          <div className="gov-mid">
            <div className="amount-row">
              <span className="amt-primary">
                {escrow.amountInr || '₹3,50,000'}
              </span>
              <span className="amt-secondary">
                {escrow.amountUsd || '/ Month Net'}
              </span>
            </div>
            <span className="release-notice">
              <span className="pulse-ping"></span>
              <span>
                {escrow.releaseDate || 'Automated Direct Transfer on 30th'}
              </span>
            </span>
          </div>
          <div className="bank-account-box">
            <span>{escrow.bank || 'Primary Account: HDFC Bank •••• 8419'}</span>
            <span className="verified-badge">Verified</span>
          </div>
        </div>

        {/* Card 3: Compliance Vault */}
        <div className="governance-card">
          <div className="gov-top">
            <span className="gov-label">Compliance Vault</span>
            <span className="material-symbols-outlined gov-icon shield">
              security
            </span>
          </div>
          <div className="compliance-list">
            {complianceVault.map((doc, idx) => (
              <div key={idx} className="compliance-item">
                <span className="doc-name">
                  <span className="material-symbols-outlined">check</span>
                  {doc.title}
                </span>
                <span className="doc-meta">{doc.meta}</span>
              </div>
            ))}
          </div>
          <div className="gov-footnote">
            All legal covenants audited by ThinkWires Legal Ops
          </div>
        </div>
      </div>

      {/* Timesheet Modal */}
      {isModalOpen && (
        <div
          className="CandidatePortal-modalOverlay"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="CandidatePortal-modalCard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Log Timesheet Hours</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-close-btn"
              >
                <CloseIcon size={16} />
              </button>
            </div>
            <form onSubmit={handleTimesheetSubmit} className="modal-form">
              <div className="modal-field">
                <label>Billed Hours (Current Week)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Sprint Milestone / Task Summary</label>
                <textarea
                  rows="3"
                  placeholder="Summarize Jira tickets, architecture deliverables, code reviews..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-actions-bar">
                <button
                  type="submit"
                  disabled={timesheetStatus === 'loading'}
                  className="btn-confirm-action"
                >
                  {timesheetStatus === 'loading'
                    ? 'Submitting...'
                    : 'Sign & Submit to Client Manager'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePayoutAndCompliance;
