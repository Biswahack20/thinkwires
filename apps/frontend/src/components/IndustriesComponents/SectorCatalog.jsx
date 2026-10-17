import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSectorCatalog } from '../../store/slices/industriesSlice';
import ScrollReveal from '../common/ScrollReveal';

const SectorCatalog = () => {
  const dispatch = useDispatch();
  const { sectors, sectorTabs, status } = useSelector((state) => state.industries);

  const [activeTab, setActiveTab] = React.useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSectorCatalog());
    }
  }, [status, dispatch]);

  const tabs = (sectorTabs && sectorTabs.length > 0) ? sectorTabs : [
    { key: 'all', label: 'All Sectors' },
    { key: 'tech', label: 'Tech & Digital' },
    { key: 'financial', label: 'Financial Services' },
    { key: 'healthcare', label: 'Healthcare & Life Sciences' },
    { key: 'industrial', label: 'Industrial & Engineering' },
    { key: 'defense', label: 'Defense & Public' },
  ];

  const filteredSectors = activeTab === 'all' 
    ? (sectors || []) 
    : (sectors || []).filter(s => (s.filter || s.id) === activeTab);

  if (status === 'loading') {
    return (
      <section className="SectorCatalog-section" id="sectors-catalog">
        <div className="SectorCatalog-loading">
          <div className="SectorCatalog-spinner"></div>
          <span className="SectorCatalog-loadingText">Loading industries...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="SectorCatalog-section" id="sectors-catalog">
      <ScrollReveal direction="up">
        <div className="SectorCatalog-header">
          <div>
            <span className="SectorCatalog-badge">Specialized Practices</span>
            <h2 className="SectorCatalog-title">Industries We Serve</h2>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="SectorCatalog-filterBar" role="tablist" aria-label="Sector Categories">
          {tabs.map(tab => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`SectorCatalog-tabBtn ${activeTab === tab.key ? 'SectorCatalog-tabBtn--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>
      
      {/* Cards Grid */}
      <div className="SectorCatalog-grid">
        {filteredSectors.map((sector, index) => {
          const bgColor = sector.iconBg || 'rgba(37, 99, 235, 0.1)';
          const textColor = sector.iconColor || 'var(--color-primary)';
          const badgeBgColor = sector.badgeColor || 'rgba(37, 99, 235, 0.1)';
          const badgeDotColor = sector.badgeDot || 'var(--color-cobalt-bright)';

          return (
            <ScrollReveal key={sector.id || index} direction="up" delay={(index % 3) * 0.1}>
              <article className="SectorCatalog-card" data-sector={sector.id}>
                <div className="SectorCatalog-cardTop">
                  <div className="SectorCatalog-cardHeader">
                    <div className="SectorCatalog-cardIconWrap" style={{ backgroundColor: bgColor, color: textColor }}>
                      <span className="material-symbols-outlined SectorCatalog-cardIcon">{sector.icon || 'star'}</span>
                    </div>
                    <span className="SectorCatalog-cardBadge" style={{ backgroundColor: badgeBgColor, color: textColor }}>
                      <span className="SectorCatalog-cardBadgeDot" style={{ backgroundColor: badgeDotColor }}></span>
                      {sector.badgeText || sector.badge}
                    </span>
                  </div>

                  <h3 className="SectorCatalog-cardTitle">{sector.title}</h3>
                  <p className="SectorCatalog-cardDesc">{sector.desc || sector.description}</p>

                  {/* Compliance Box */}
                  <div className="SectorCatalog-complianceBox">
                    <div className="SectorCatalog-complianceHeader">
                      <span className="material-symbols-outlined SectorCatalog-complianceIcon" style={{ color: textColor }}>
                        verified_user
                      </span>
                      Mandatory Compliance Stacks
                    </div>
                    <p className="SectorCatalog-complianceText">{sector.complianceText || sector.compliance}</p>
                  </div>

                  {/* Placements */}
                  <div className="SectorCatalog-placementsSection">
                    <span className="SectorCatalog-placementsLabel">High-Demand Placements</span>
                    <div className="SectorCatalog-tags">
                      {sector.placements && sector.placements.map((placement, i) => (
                        <span key={i} className="SectorCatalog-tag">{placement}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="SectorCatalog-cardFooter">
                  <span className="SectorCatalog-podsCount">
                    Pods Deployed: <strong>{sector.podsDeployed || sector.pods || '20+'}</strong>
                  </span>
                  <a className="SectorCatalog-deployLink" href="#capability-briefing">
                    Deploy Talent
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </a>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default SectorCatalog;
