import React from 'react';
import AnimatedCounter from '../common/AnimatedCounter';

const EorKpiStrip = ({ kpiStrip = [] }) => {
  if (!kpiStrip.length) return null;

  return (
    <section className="Eor-kpiStrip">
      <div className="Payroll-sectionContainer">
        <div className="Eor-kpiGrid">
          {kpiStrip.map((kpi, idx) => {
            const num = parseFloat(String(kpi.value).replace(/[^0-9.-]+/g, ''));
            const suffix = String(kpi.value).replace(/^[0-9.-]+/, '');
            const hasNum = !isNaN(num);

            return (
              <div key={idx} className="Eor-kpiCard">
                <div className={`Eor-kpiValue ${kpi.accent}`}>
                  {hasNum ? (
                    <AnimatedCounter value={num} suffix={suffix} duration={1600} />
                  ) : (
                    kpi.value
                  )}
                </div>
                <div className="Eor-kpiLabel">{kpi.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EorKpiStrip;
