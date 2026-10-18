import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOpenings } from '../../store/slices/homeSlice';
import ApplyModal from '../common/ApplyModal';
import SectionBadge from '../common/SectionBadge';
import JobSpecModal from '../JobsComponents/JobSpecModal';

const Openings = () => {
  const dispatch = useDispatch();
  const { openings, status } = useSelector((state) => state.home);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobForSpec, setSelectedJobForSpec] = useState(null);

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

  // Sort by latest posted date (descending), then priority
  const sortedOpenings = [...openings].sort((a, b) => {
    const timeA = new Date(a.postedDate || 0).getTime();
    const timeB = new Date(b.postedDate || 0).getTime();
    if (timeB !== timeA) return timeB - timeA;
    return (a.priority || 99) - (b.priority || 99);
  });

  const filteredOpenings = sortedOpenings.filter((job) => {
    if (activeFilter.startsWith('All Roles')) return true;
    if (activeFilter === 'SAP & Enterprise') {
      return (
        job.title?.toLowerCase().includes('sap') ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes('sap') || s.toLowerCase().includes('abap')))
      );
    }
    if (activeFilter === 'Full Stack & AEM') {
      return (
        job.title?.toLowerCase().includes('aem') ||
        job.title?.toLowerCase().includes('full stack') ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes('aem') || s.toLowerCase().includes('react')))
      );
    }
    if (activeFilter === 'Platform Architecture') {
      return (
        job.title?.toLowerCase().includes('architect') ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes('ach') || s.toLowerCase().includes('platform')))
      );
    }
    if (activeFilter === 'PLM & Systems') {
      return (
        job.title?.toLowerCase().includes('plm') ||
        job.title?.toLowerCase().includes('teamcenter') ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes('plm') || s.toLowerCase().includes('bmide')))
      );
    }
    return true;
  });

  // Display ONLY the latest 4 job role application cards
  const displayOpenings = filteredOpenings.slice(0, 4);

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
          <>
            <div className={'Openings-grid'}>
              {displayOpenings.map((job) => (
                <div key={job.id} className={'Openings-card'}>
                  <div className={'Openings-cardHeader'}>
                    <div className={'Openings-companyInfo'}>
                      <div className={'Openings-companyLogo'}>TW</div>
                      <div className={'Openings-companyText'}>
                        <span className={'Openings-companyName'}>
                          Enterprise Client (Confidential)
                        </span>
                        <span className={'Openings-jobTitle'}>{job.title}</span>
                      </div>
                    </div>
                    <div
                      className={`Openings-badge Openings-${job.tagColor || job.badgeColor || 'green'}`}
                    >
                      <span className="Openings-pulseDot"></span>
                      {job.tag || job.badge || 'Active Opening'}
                    </div>
                  </div>

                  <div className={'Openings-metaInfo'}>
                    <div className={'Openings-metaItem'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>
                        {job.workMode === 'Work From Home' ? 'home' : job.workMode === 'Work From Office' ? 'domain' : 'location_on'}
                      </span>
                      <span>{job.location} ({job.workMode || 'Hybrid'})</span>
                    </div>
                    <div className={'Openings-metaItem'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>schedule</span>
                      <span>{job.experience} • {job.jobMode || 'Permanent'}</span>
                    </div>
                    <div className={'Openings-metaItem'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>payments</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className={'Openings-metaItem'}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-secondary)' }}>timer</span>
                      <span>Notice: {job.noticePeriod || job.joining || 'Immediate'}</span>
                    </div>
                  </div>

                  <p className={'Openings-desc'}>{job.description}</p>

                  <div className={'Openings-skills'}>
                    {job.skills && job.skills.map((skill) => (
                      <span key={skill} className={'Openings-skillBadge'}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className={'Openings-cardFooter'}>
                    <span className={'Openings-postedDate'}>
                      Posted:{' '}
                      {job.postedDate ? new Date(job.postedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }) : 'Recently'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedJobForSpec(job)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontWeight: 700,
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          padding: '0.35rem 0.5rem',
                          textDecoration: 'underline',
                        }}
                      >
                        View Job Spec
                      </button>
                      <button
                        onClick={() => setSelectedJob(job.title)}
                        className={'Openings-applyBtn'}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
              <Link
                to="/jobs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '9999px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                }}
              >
                <span>Explore All 130+ Tech Openings</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </Link>
            </div>
          </>
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
      {/* Complete Job Specifications Modal */}
      {selectedJobForSpec && (
        <JobSpecModal
          job={selectedJobForSpec}
          onClose={() => setSelectedJobForSpec(null)}
          onApply={(j) => {
            setSelectedJobForSpec(null);
            setSelectedJob(j.title);
          }}
        />
      )}

      <ApplyModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        roleTitle={selectedJob || ''}
      />
    </section>
  );
};

export default Openings;
