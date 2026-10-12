import React from 'react';

const StaffAugBenefits = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, cards = [] } = data;

  return (
    <section className="StaffAug-benefitsSection">
      <div className="StaffAug-container">
        <div className="StaffAug-sectionHeader left-align">
          <span className="StaffAug-eyebrow primary">{eyebrow}</span>
          <h2 className="StaffAug-title">{heading}</h2>
          <p className="StaffAug-desc">{description}</p>
        </div>

        <div className="StaffAug-benefitsGrid">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`StaffAug-benefitCard ${card.span === 2 ? 'span-2' : ''}`}
            >
              <div className="card-top">
                <div className={`card-icon ${card.accent || 'primary'}`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>
              </div>

              <div className={`card-stat-row ${card.accent || 'primary'}`}>
                <span className="material-symbols-outlined">{card.iconStat}</span>
                <span>{card.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffAugBenefits;
