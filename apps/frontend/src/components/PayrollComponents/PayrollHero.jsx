import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitPayrollConsultation, resetSubmitStatus } from '../../store/slices/payrollSlice';

const PayrollHero = ({ data }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    employeeSize: '',
    serviceReq: 'Payroll Outsourcing',
    phoneNumber: '',
    emailAddress: '',
  });

  const dispatch = useDispatch();
  const { submitStatus, submitMessage } = useSelector((state) => state.payroll || {});

  if (!data) return null;

  const {
    badge,
    heading,
    headingHighlight,
    description,
    ctaConsultationText,
    ctaComplianceText,
    trustMetrics = [],
    telemetryCard = {},
  } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitPayrollConsultation(formData));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="Payroll-heroSection">
      <div className="Payroll-ambientGlowCobalt"></div>
      <div className="Payroll-ambientGlowEmerald"></div>

      <div className="Payroll-heroContainer">
        <div className="Payroll-heroGrid">
          {/* Left Column */}
          <div className="Payroll-heroContent">
            <div className="Payroll-badge">
              <span className="Payroll-badgeDot"></span>
              <span className="Payroll-badgeText">{badge}</span>
            </div>

            <h1 className="Payroll-heroHeadline">
              {heading}{' '}
              <span className="Payroll-highlightGradient">{headingHighlight}</span>
            </h1>

            <p className="Payroll-heroDesc">{description}</p>

            <div className="Payroll-heroActions">
              <a href="#consultation-form" className="Payroll-btnPrimary">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  verified
                </span>
                <span>{ctaConsultationText}</span>
              </a>

              <a href="#compliance-suite" className="Payroll-btnSecondary">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  cloud_download
                </span>
                <span>{ctaComplianceText}</span>
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="Payroll-trustBadgesRow">
              {trustMetrics.map((metric, idx) => {
                const colorClass = idx === 0 ? 'emerald' : idx === 1 ? 'cobalt' : 'secondary';
                return (
                  <div key={idx} className="Payroll-trustBadgeCard">
                    <div className={`Payroll-trustIconWrapper ${colorClass}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {metric.icon}
                      </span>
                    </div>
                    <div>
                      <div className="Payroll-trustValue">{metric.value}</div>
                      <div className="Payroll-trustLabel">{metric.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Telemetry Card */}
          <div className="Payroll-telemetryCard">
            <div className="Payroll-telemetryHeader">
              <div className="Payroll-telemetryTitleWrap">
                <span className="Payroll-telemetryLiveDot"></span>
                <span className="Payroll-telemetryTitle">{telemetryCard.title}</span>
              </div>
              <span className="Payroll-telemetryBadge">{telemetryCard.statusBadge}</span>
            </div>

            <div className="Payroll-metricDisplayBlock">
              <div className="Payroll-metricTopRow">
                <span>{telemetryCard.batchMonth}</span>
                <span className="Payroll-reconciledTag">{telemetryCard.reconciledText}</span>
              </div>
              <div className="Payroll-amountValue">{telemetryCard.totalAmount}</div>

              <div className="Payroll-progressBars">
                {(telemetryCard.breakdown || []).map((b, i) => (
                  <div key={i}>
                    <div className="Payroll-progressRow">
                      <span>{b.label}</span>
                      <span style={{ fontWeight: 700 }}>{b.percentage}</span>
                    </div>
                    <div className="Payroll-progressBarBg">
                      <div
                        className={`Payroll-progressFill ${b.color}`}
                        style={{ width: b.percentage }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="Payroll-auditLogsList">
              {(telemetryCard.auditLogs || []).map((log, i) => (
                <div key={i} className="Payroll-auditLogItem">
                  <div className="Payroll-auditLogLeft">
                    <span
                      className={`material-symbols-outlined ${log.color}`}
                      style={{ fontSize: '18px' }}
                    >
                      {log.icon}
                    </span>
                    <span>{log.title}</span>
                  </div>
                  <span className={`Payroll-auditLogStatus ${log.color}`}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PayrollHero;
