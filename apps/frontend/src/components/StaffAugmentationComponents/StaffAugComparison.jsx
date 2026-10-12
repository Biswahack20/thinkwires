import React from 'react';

const StaffAugComparison = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, rows = [] } = data;

  return (
    <section className="StaffAug-comparisonSection">
      <div className="StaffAug-container">
        <div className="StaffAug-sectionHeader">
          <span className="StaffAug-eyebrow primary">{eyebrow}</span>
          <h2 className="StaffAug-title">{heading}</h2>
          <p className="StaffAug-desc">{description}</p>
        </div>

        <div className="StaffAug-tableWrapper">
          <table className="StaffAug-table">
            <thead>
              <tr>
                <th className="feature-col">Feature / Capability</th>
                <th className="primary-col">
                  <div className="header-badge">
                    <span className="material-symbols-outlined">star</span>
                    <span>Staff Augmentation</span>
                  </div>
                  <span className="sub">ThinkWires Core</span>
                </th>
                <th>
                  <span>Dedicated Tech Pods</span>
                  <span className="sub">Turnkey Team</span>
                </th>
                <th>
                  <span>Traditional IT Outsourcing</span>
                  <span className="sub">Vendor-led Project</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  <td className="feature-cell">{r.feature}</td>
                  <td className="primary-cell">
                    <span className="material-symbols-outlined text-emerald-accent">check_circle</span>
                    <span>{r.aug}</span>
                  </td>
                  <td className="regular-cell">{r.pods}</td>
                  <td className="muted-cell">{r.trad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default StaffAugComparison;
