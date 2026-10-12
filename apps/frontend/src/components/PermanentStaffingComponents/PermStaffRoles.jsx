import React from 'react';

const PermStaffRoles = ({ data }) => {
  if (!data) return null;
  const { eyebrow, heading, description, items = [] } = data;

  return (
    <section className="PermStaff-rolesSection" id="specialized-roles">
      <div className="PermStaff-container">
        <div className="PermStaff-rolesHeaderRow">
          <div>
            <span className="PermStaff-eyebrow emerald">{eyebrow}</span>
            <h2 className="PermStaff-rolesTitle">{heading}</h2>
            <p className="PermStaff-rolesDesc">{description}</p>
          </div>
          <div className="PermStaff-rolesActiveBadge">
            <span className="dot"></span>
            <span>Live Executive Talent Search Active</span>
          </div>
        </div>

        <div className="PermStaff-rolesGrid">
          {items.map((role, idx) => (
            <div key={idx} className="PermStaff-roleCard">
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
                    <span key={tIdx} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PermStaffRoles;
