import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../../store/slices/homeSlice';
import AnimatedCounter from '../common/AnimatedCounter';

const JobsStats = () => {
  const dispatch = useDispatch();
  const { stats, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.stats === 'idle') {
      dispatch(fetchStats());
    }
  }, [dispatch, status.stats]);

  const vacanciesVal = stats.vacancies ?? 125;
  const companiesVal = stats.companies ?? 740;
  const hiredVal = stats.hired ?? 999;
  const satisfactionVal = stats.satisfaction ?? 95;

  const statsList = [
    {
      value: vacanciesVal,
      symbol: '+',
      symbolColor: 'green',
      label: 'NEW JOB VACANCIES',
      subtext: 'Active weekly enterprise mandates'
    },
    {
      value: companiesVal,
      symbol: '+',
      symbolColor: 'blue',
      label: 'COMPANIES WORLDWIDE',
      subtext: 'US, Canada, UK, and APAC partners'
    },
    {
      value: hiredVal,
      symbol: '+',
      symbolColor: 'green',
      label: 'PEOPLE HIRED',
      subtext: 'Successful senior technical placements'
    },
    {
      value: satisfactionVal,
      symbol: '%',
      symbolColor: 'blue',
      label: 'CANDIDATE SATISFACTION',
      subtext: 'Transparent offer & onboarding ratings'
    }
  ];

  return (
    <section className="JobsStats-figmaSection">
      <div className="JobsStats-figmaContainer">
        <div className="JobsStats-stripGrid">
          {statsList.map((stat, idx) => (
            <div key={idx} className="JobsStats-metricBox">
              <div className="JobsStats-numberVal">
                <AnimatedCounter value={stat.value} duration={1800} />
                <span className={`JobsStats-symbol-${stat.symbolColor}`}>
                  {stat.symbol}
                </span>
              </div>
              <div className="JobsStats-metricLabel">{stat.label}</div>
              <p className="JobsStats-metricSubtext">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobsStats;
