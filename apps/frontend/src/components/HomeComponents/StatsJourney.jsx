import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../store/slices/homeSlice';
import SectionBadge from '../common/SectionBadge';

const StatsJourney = () => {
  const dispatch = useDispatch();
  const { stats, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.stats === 'idle') {
      dispatch(fetchStats());
    }
  }, [dispatch, status.stats]);

  const timelineData = [
    {
      year: '2022',
      title: 'The Beginning',
      desc: 'Founded with the vision that talent knows no borders. Small elite technical recruitment core established in Noida.',
    },
    {
      year: '2023',
      title: 'Growth Phase',
      desc: 'Break-even accelerated through alignment of specialized SAP & Cloud technical pods with tier-1 enterprise accounts.',
    },
    {
      year: '2024',
      title: 'Global Expansion',
      desc: 'Launched cross-border US & Canada talent corridors, establishing Employer of Record (EOR) frameworks.',
    },
    {
      year: '2025+',
      title: 'Innovation Leader',
      desc: 'Pioneering AI-driven automated vetting pipelines and statutory multi-currency payroll outsourcing.',
    },
  ];

  return (
    <section className={'StatsJourney-section'}>
      <div className={'StatsJourney-container'}>
        {/* Stats Section */}
        <div className={'StatsJourney-statsGrid'}>
          <div className={'StatsJourney-statCard'}>
            <div className={'StatsJourney-statValue'}>
              {stats.jobsFilled}
              <span className={'StatsJourney-statAccent'}>+</span>
            </div>
            <h4 className={'StatsJourney-statTitle'}>HOT TECH JOBS FILLED</h4>
            <p className={'StatsJourney-statDesc'}>
              Across Tier-1 IT & Product Firms
            </p>
          </div>
          <div className={'StatsJourney-statCard'}>
            <div className={'StatsJourney-statValue'}>
              {stats.corePlacements}
              <span className={'StatsJourney-statAccent'}>+</span>
            </div>
            <h4 className={'StatsJourney-statTitle'}>
              ON-ROLL CORE PLACEMENTS
            </h4>
            <p className={'StatsJourney-statDesc'}>
              Full-time permanent engineering leaders
            </p>
          </div>
          <div className={'StatsJourney-statCard'}>
            <div className={'StatsJourney-statValue'}>
              {stats.contingentHired}
              <span className={'StatsJourney-statAccent'}>+</span>
            </div>
            <h4 className={'StatsJourney-statTitle'}>TOTAL CONTINGENT HIRED</h4>
            <p className={'StatsJourney-statDesc'}>
              Deployed in agile enterprise squads
            </p>
          </div>
          <div className={'StatsJourney-statCard'}>
            <div className={'StatsJourney-statValue'}>
              {stats.clientRetention}
              <span className={'StatsJourney-statAccent'}>%</span>
            </div>
            <h4 className={'StatsJourney-statTitle'}>CLIENT RETENTION RATE</h4>
            <p className={'StatsJourney-statDesc'}>
              Repeat multi-quarter staffing engagements
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className={'StatsJourney-timelineHeader'}>
          <SectionBadge text="OUR JOURNEY" />
          <h2 className={'StatsJourney-timelineTitle'}>
            Milestones of Exponential Growth
          </h2>
          <p className={'StatsJourney-timelineDesc'}>
            From visionary inception in Noida to an international tech workforce
            catalyst.
          </p>
        </div>

        <div className={'StatsJourney-timelineGrid'}>
          {timelineData.map((item, index) => (
            <div key={index} className={'StatsJourney-timelineCard'}>
              <h3 className={'StatsJourney-timelineYear'}>{item.year}</h3>
              <h4 className={'StatsJourney-timelineCardTitle'}>{item.title}</h4>
              <p className={'StatsJourney-timelineCardDesc'}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsJourney;
