import React from 'react';

const FindTalentComparison = ({ matrix = [] }) => {
  if (!matrix || matrix.length === 0) return null;

  return (
    <section className="FindTalent-comparisonSection">
      <div className="FindTalent-container">
        <div className="FindTalent-comparisonHeader">
          <span className="FindTalent-eyebrow">
            Structural Sourcing Advantage
          </span>
          <h2 className="FindTalent-sectionTitle">
            Why Engineering Leaders Choose ThinkWires vs. Legacy Agencies
          </h2>
          <p className="FindTalent-sectionSubtitle">
            Compare the engineering-first talent aggregation model against
            traditional cold recruiters.
          </p>
        </div>

        <div className="FindTalent-tableCard">
          <table className="FindTalent-table">
            <thead>
              <tr>
                <th className="col-metric">Evaluation Metric</th>
                <th className="col-traditional">Traditional Consultancies</th>
                <th className="col-thinkwires">
                  <div className="thinkwires-badge">
                    <span className="material-symbols-outlined star-icon">
                      stars
                    </span>
                    <span>ThinkWires Aggregator</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={idx}>
                  <td className="cell-metric">{row.metric}</td>
                  <td className="cell-traditional">{row.traditional}</td>
                  <td className="cell-thinkwires">{row.thinkwires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default FindTalentComparison;
