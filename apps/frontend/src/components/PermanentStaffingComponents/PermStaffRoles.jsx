import React from 'react';
import ScrollReveal from '../common/ScrollReveal';

const PermStaffRoles = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, items = [] } = data;

  return (
    <section className="PermStaff-rolesSection" id="specialized-roles">
      <div className="PermStaff-container">
        <ScrollReveal direction="up" distance={40} className="PermStaff-rolesHeaderRow">
          <div>
            <span className="PermStaff-eyebrow emerald">{eyebrow}</span>
            <h2 className="PermStaff-rolesTitle">{heading}</h2>
            <p className="PermStaff-rolesDesc">{description}</p>
          </div>
          <div className="PermStaff-rolesActiveBadge">
            <span className="dot"></span>
            <span>Live Executive Talent Search Active</span>
          </div>
        </ScrollReveal>

        <div className="PermStaff-rolesGrid">
          {items.map((role, idx) => (
            <ScrollReveal
              key={idx}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              delay={idx * 0.1}
              distance={60}
              style={{ display: 'flex' }}
            >
              <div className="PermStaff-roleCard" style={{ width: '100%' }}>
                <div className="card-top">
                  <div className="badge-row">
                    <span className="role-badge">{role.badge}</span>
                    <span className="material-symbols-outlined icon-token">{role.icon}</span>
                  </div>
                  <h3 className="role-heading">{role.title}</h3>
                  <p className="role-desc">{role.description}</p>
                </div>

                <div>
                  <div className="positions-list">
                    {(role.positions || []).map((pos, pIdx) => (
                      <div key={pIdx} className="pos-item">
                        <span className="pos-title">{pos.title}</span>
                        <span className="pos-sla">{pos.sla}</span>
                      </div>
                    ))}
                  </div>

                  <div className="tags-row">
                    {(role.tags || []).map((tag, tIdx) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PermStaffRoles;
