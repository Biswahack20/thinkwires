import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReports } from '../../store/slices/homeSlice';
import SectionBadge from '../common/SectionBadge';

const Reports = () => {
  const dispatch = useDispatch();
  const { reports: reportsData, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.reports === 'idle') {
      dispatch(fetchReports());
    }
  }, [dispatch, status.reports]);

  return (
    <section className={'Reports-section'}>
      <div className={'Reports-container'}>
        <div className={'Reports-header'}>
          <div className={'Reports-headerLeft'}>
            <SectionBadge text="TALENT ADVISORY INSIGHTS" />
            <h2 className={'Reports-title'}>
              Our Latest Tech & Market Reports
            </h2>
          </div>
          <a href="#" className={'Reports-browseLink'}>
            Browse All Articles &rarr;
          </a>
        </div>

        <div className={'Reports-grid'}>
          {reportsData.map((report) => (
            <div key={report.id} className={'Reports-card'}>
              <div className={'Reports-imageContainer'}>
                <img
                  src={report.image}
                  alt={report.title}
                  className={'Reports-image'}
                />
                <span className={'Reports-tag'}>{report.tag}</span>
              </div>
              <div className={'Reports-content'}>
                <span className={'Reports-date'}>{report.date}</span>
                <h3 className={'Reports-cardTitle'}>{report.title}</h3>
                <p className={'Reports-cardDesc'}>{report.desc}</p>
                <a href="#" className={'Reports-readLink'}>
                  Read Article &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reports;
