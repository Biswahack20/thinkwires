import React from 'react';

const EorKpiStrip = ({ kpiStrip = [] }) => {
  if (!kpiStrip.length) return null;

  return (
    <section className="Eor-kpiStrip">
      <div className="Payroll-sectionContainer">
        <div className="Eor-kpiGrid">
          {kpiStrip.map((kpi, idx) => (
            <div key={idx} className="Eor-kpiCard">
              <div className={`Eor-kpiValue ${kpi.accent}`}>{kpi.value}</div>
              <div className="Eor-kpiLabel">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EorKpiStrip;
