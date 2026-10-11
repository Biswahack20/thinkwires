import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOpenings } from '../../store/slices/homeSlice';
import ApplyModal from '../common/ApplyModal';
import SectionBadge from '../common/SectionBadge';

const Openings = () => {
  const dispatch = useDispatch();
  const { openings, status } = useSelector((state) => state.home);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (status.openings === 'idle') {
      dispatch(fetchOpenings());
    }
  }, [dispatch, status.openings]);

  const [activeFilter, setActiveFilter] = useState('All Roles (4)');

  const filters = [
    'All Roles (4)',
    'SAP & Enterprise',
    'Full Stack & AEM',
    'Platform Architecture',
    'PLM & Systems',
  ];

  const filteredOpenings = openings.filter((job) => {
    if (activeFilter === 'All Roles (4)') return true;
    if (activeFilter === 'SAP & Enterprise') {
      return (
        job.title.toLowerCase().includes('sap') ||
        job.skills.some((s) => s.toLowerCase().includes('sap') || s.toLowerCase().includes('abap'))
      );
    }
    if (activeFilter === 'Full Stack & AEM') {
      return (
        job.title.toLowerCase().includes('aem') ||
        job.title.toLowerCase().includes('full stack') ||
        job.skills.some((s) => s.toLowerCase().includes('aem') || s.toLowerCase().includes('react'))
      );
    }
    if (activeFilter === 'Platform Architecture') {
      return (
        job.title.toLowerCase().includes('architect') ||
        job.skills.some((s) => s.toLowerCase().includes('ach') || s.toLowerCase().includes('platform'))
      );
    }
    if (activeFilter === 'PLM & Systems') {
      return (
        job.title.toLowerCase().includes('plm') ||
        job.title.toLowerCase().includes('teamcenter') ||
        job.skills.some((s) => s.toLowerCase().includes('plm') || s.toLowerCase().includes('bmide'))
      );
    }
    return true;
  });

  return (
    <section className={'Openings-openingsSection'} id="hot-jobs">
      <div className={'Openings-container'}>
        <div className={'Openings-headerTop'}>
          <div className={'Openings-headerLeft'}>
            <SectionBadge text="Live Deployment Pipeline" />
            <h2 className={'Openings-title'}>High Priority Openings</h2>
            <p className={'Openings-subtext'}>
              Explore verified openings ready for immediate hire. Direct
              interview routing with client engineering leadership.
            </p>
          </div>
          <div className={'Openings-headerRight'}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-emerald-accent)', fontSize: '24px' }}>bolt</span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-navy-dark)' }}>130+</span>
              <span style={{ fontWeight: 500, fontSize: '0.75rem', color: '#64748b' }}>
                Verified Tech Roles
              </span>
            </div>
          </div>
        </div>

        <div className={'Openings-filters'}>
          {filters.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(f)}
              className={`${'Openings-filterBtn'} ${activeFilter === f ? 'Openings-active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {status.openings === 'loading' ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading priority openings...</div>
        ) : (
          <div className={'Openings-grid'}>
            {filteredOpenings.map((job) => (
              <div key={job.id} className={'Openings-card'}>
                <div className={'Openings-cardHeader'}>
                  <div className={'Openings-companyInfo'}>
                    <div className={'Openings-companyLogo'}>TW</div>
                    <div className={'Openings-companyText'}>
                      <span className={'Openings-companyName'}>
                        {job.company}
                      </span>
                      <span className={'Openings-jobTitle'}>{job.title}</span>
                    </div>
                  </div>
                  <div
                    className={`Openings-badge Openings-${job.tagColor || 'green'}`}
                  >
                    <span className="Openings-pulseDot"></span>
                    {job.tag}
                  </div>
                </div>

                <div className={'Openings-metaInfo'}>
                  <div className={'Openings-metaItem'}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
                      {job.location && job.location.toLowerCase().includes('remote') ? 'home_work' : 'location_on'}
                    </span>
                    <span>{job.location}</span>
                  </div>
                  <div className={'Openings-metaItem'}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>schedule</span>
                    <span>{job.experience}</span>
                  </div>
                  <div className={'Openings-metaItem'}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>payments</span>
                    <span>{job.salary}</span>
                  </div>
                </div>

                <p className={'Openings-desc'}>{job.description}</p>

                <div className={'Openings-skills'}>
                  {job.skills.map((skill) => (
                    <span key={skill} className={'Openings-skillBadge'}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className={'Openings-cardFooter'}>
                  <span className={'Openings-postedDate'}>
                    Posted:{' '}
                    {new Date(job.postedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => setSelectedJob(job.title)}
                    className={'Openings-applyBtn'}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={'Openings-uploadCtaBanner'}>
          <div className={'Openings-uploadLeft'}>
            <div className={'Openings-uploadIcon'}>
              <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>folder_special</span>
            </div>
            <div className={'Openings-uploadText'}>
              <h4>Looking for unlisted or confidential enterprise openings?</h4>
              <p>
                Drop your technical resume into our active executive talent
                registry.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedJob('General Engineering Candidate Pool')}
            className={'Openings-uploadBtn'}
          >
            Upload CV / Profile
          </button>
        </div>
      </div>
      <ApplyModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        roleTitle={selectedJob || ''}
      />
    </section>
  );
};

export default Openings;
