import React, { useState } from 'react';
import { CloseIcon } from '../../admin/AdminIcons';

const CandidatePipelines = ({ pipelines = [] }) => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="CandidatePortal-cardSection">
      <div className="section-header-bar">
        <div>
          <div className="title-with-dot">
            <span className="live-dot pulse"></span>
            <h2 className="section-main-title">
              Active Applications &amp; Dispatch Pipeline
            </h2>
          </div>
          <p className="section-subtext">
            Live interview dispatches coordinated through ThinkWires Priority
            SLA.
          </p>
        </div>
        <span className="pipeline-count-pill">
          {pipelines.length} Active Pipelines
        </span>
      </div>

      <div className="CandidatePortal-pipelineList">
        {pipelines.map((pipe) => (
          <div key={pipe.id} className="pipeline-row-card">
            <div className="pipeline-left">
              <div
                className={`pipeline-avatar-badge type-${pipe.badge.toLowerCase()}`}
              >
                {pipe.badge}
              </div>

              <div className="pipeline-info">
                <div className="title-tag-row">
                  <h3 className="pipe-role">{pipe.role}</h3>
                  <span className={`pipe-status-tag tag-${pipe.statusType}`}>
                    {pipe.statusType === 'urgent' && (
                      <span className="urgent-dot"></span>
                    )}
                    {pipe.status}
                  </span>
                </div>

                <div className="pipe-company">
                  <span className="material-symbols-outlined icon">domain</span>
                  <span>{pipe.company}</span>
                </div>

                <div className="pipe-meta-row">
                  <span className="meta-item">
                    <span className="material-symbols-outlined icon">
                      speed
                    </span>
                    <span>{pipe.sla}</span>
                  </span>
                  <span className="meta-sep">•</span>
                  <span className="meta-item highlight">{pipe.panel}</span>
                </div>
              </div>
            </div>

            <div className="pipeline-actions">
              {pipe.canJoin && (
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: 'zoom', data: pipe })}
                  className="btn-join-room"
                >
                  <span className="material-symbols-outlined">videocam</span>
                  <span>Join Zoom Room</span>
                </button>
              )}
              {pipe.isOffer && (
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: 'offer', data: pipe })}
                  className="btn-review-offer"
                >
                  <span className="material-symbols-outlined">article</span>
                  <span>Review Offer Letter</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveModal({ type: 'dossier', data: pipe })}
                className="btn-mandate-dossier"
              >
                <span className="material-symbols-outlined">description</span>
                <span>Mandate Dossier</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {activeModal && (
        <div
          className="CandidatePortal-modalOverlay"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="CandidatePortal-modalCard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                {activeModal.type === 'zoom' && 'Joining Interview Session'}
                {activeModal.type === 'offer' &&
                  'Enterprise Offer Letter Overview'}
                {activeModal.type === 'dossier' &&
                  'Client Mandate Specification'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="modal-close-btn"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="modal-body">
              {activeModal.type === 'zoom' && (
                <div>
                  <p>
                    <strong>Session:</strong> Final CTO Technical Architecture
                    Round
                  </p>
                  <p>
                    <strong>Client:</strong> {activeModal.data.company}
                  </p>
                  <p>
                    <strong>Security:</strong> SOC 2 Audited Session recording
                    enabled.
                  </p>
                  <div className="modal-actions-bar">
                    <a
                      href="https://zoom.us"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-confirm-action"
                    >
                      Launch Secure Video Room
                    </a>
                  </div>
                </div>
              )}
              {activeModal.type === 'offer' && (
                <div>
                  <p>
                    <strong>Position:</strong> {activeModal.data.role}
                  </p>
                  <p>
                    <strong>Entity:</strong> {activeModal.data.company}
                  </p>
                  <p>
                    <strong>Compensation:</strong> ₹44 LPA Base + Milestone
                    Escrow + US Equity Component
                  </p>
                  <p>
                    <strong>Decision Window:</strong> 4 Business Days remaining.
                  </p>
                  <div className="modal-actions-bar">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-confirm-action"
                    >
                      Download Signed Offer Letter PDF
                    </button>
                  </div>
                </div>
              )}
              {activeModal.type === 'dossier' && (
                <div>
                  <p>
                    <strong>Mandate:</strong> {activeModal.data.role}
                  </p>
                  <p>
                    <strong>Client:</strong> {activeModal.data.company}
                  </p>
                  <p>
                    <strong>SLA:</strong> {activeModal.data.sla}
                  </p>
                  <p>
                    <strong>Panel:</strong> {activeModal.data.panel}
                  </p>
                  <div className="modal-actions-bar">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="btn-confirm-action"
                    >
                      Close Specification
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePipelines;
