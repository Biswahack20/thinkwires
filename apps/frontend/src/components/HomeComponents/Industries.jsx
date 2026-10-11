import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIndustries } from '../../store/slices/homeSlice';

const getIndustryMaterialIcon = (iconName) => {
  switch (iconName) {
    case 'monitor':
      return 'terminal';
    case 'building':
      return 'account_balance';
    case 'medical':
      return 'medical_services';
    case 'robot':
      return 'smart_toy';
    case 'plane':
      return 'flight';
    case 'antenna':
      return 'cell_tower';
    default:
      return 'business_center';
  }
};

const Industries = () => {
  const dispatch = useDispatch();
  const { industries, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.industries === 'idle') {
      dispatch(fetchIndustries());
    }
  }, [dispatch, status.industries]);

  return (
    <section className="Industries-section">
      <div className="Industries-container">
        <div className="Industries-header">
          <span className="Industries-tag">DOMAIN EXPERTISE</span>
          <h2 className="Industries-title">Industries We Empower</h2>
          <p className="Industries-description">
            Supplying deep niche technical knowledge tailored to regulatory,
            compliance, and velocity needs across key sectors.
          </p>
        </div>

        <div className="Industries-grid">
          {industries.map((ind) => (
            <div key={ind.id} className="Industries-card group">
              <div className={`Industries-iconWrapper Industries-${ind.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-[26px]">
                  {getIndustryMaterialIcon(ind.icon)}
                </span>
              </div>
              <h3 className="Industries-cardTitle">{ind.name}</h3>
              <p className="Industries-cardDesc">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
