import React from 'react';
import { useSelector } from 'react-redux';
import ScrollReveal from '../common/ScrollReveal';

const BenchVettingGates = () => {
  const { vettingGates } = useSelector((state) => state.bench);

  const fallbackGates = [
    {
      gateNumber: 'GATE 01',
      title: 'Algorithmic Rigor & System Diagnostics',
      passRate: 'Top 15% Pass Rate',
      details: [
        'Automated code complexity & edge-case testing',
        'Time & memory complexity profiling in isolated sandbox',
        'Refactoring legacy code under strict production constraints',
      ],
      badge: 'Automated Code Sandbox',
    },
    {
      gateNumber: 'GATE 02',
      title: 'Live System Architecture Defense',
      passRate: 'Top 4% Pass Rate',
      details: [
        'Live 60-min defense with a Staff Engineer at Thinkwires',
        'Designing for 10M+ DAU, high availability, and failover',
        'Live chaos engineering & unexpected dependency failure scenario',
      ],
      badge: 'Staff Engineer Interview',
    },
    {
      gateNumber: 'GATE 03',
      title: 'Executive Communication & Client Fit',
      passRate: 'Final 1.5% Accepted',
      details: [
        'Async client status reporting & stakeholder alignment',
        'Security compliance & IP adherence background audit',
        'Final vetting placement into Thinkwires Rapid Bench pool',
      ],
      badge: 'Executive Evaluation',
    },
  ];

  const gates =
    vettingGates && vettingGates.length > 0 ? vettingGates : fallbackGates;

  return (
    <section className="BenchGates-section">
      <div className="BenchGates-container">
        <div className="BenchGates-header">
          <span className="BenchGates-tag">VETTING METHODOLOGY</span>
          <h2 className="BenchGates-title">
            The 3-Tier Technical Vetting Funnel
          </h2>
          <p className="BenchGates-subtitle">
            Out of every 1,000 engineering applicants, only 15 make it to our
            active bench. Here is how we filter out 98.5% of noise.
          </p>
        </div>

        <div className="BenchGates-grid">
          {gates.map((gate, idx) => (
            <ScrollReveal
              key={idx}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              delay={idx * 0.12}
              distance={70}
              style={{ display: 'flex' }}
            >
              <div className="BenchGates-card" style={{ width: '100%' }}>
                <div className="BenchGates-cardHeader">
                  <span className="BenchGates-gateNumber">
                    {gate.gateNumber}
                  </span>
                  <span className="BenchGates-passRate">{gate.passRate}</span>
                </div>
                <h3 className="BenchGates-cardTitle">{gate.title}</h3>
                <div className="BenchGates-badgePill">
                  <span className="material-symbols-outlined">verified</span>
                  <span>{gate.badge}</span>
                </div>
                <ul className="BenchGates-detailsList">
                  {(gate.details || []).map((item, dIdx) => (
                    <li key={dIdx}>
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenchVettingGates;
