import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchReports } from '../../store/slices/homeSlice';

const Reports = () => {
  const dispatch = useDispatch();
  const { reports: reportsData, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.reports === 'idle') {
      dispatch(fetchReports());
    }
  }, [dispatch, status.reports]);

  return (
    <section className="Reports-section">
      <div className="Reports-container">
        <div className="Reports-header">
          <div className="Reports-headerLeft">
            <span className="Reports-tag">TALENT ADVISORY INSIGHTS</span>
            <h2 className="Reports-title">
              Our Latest Tech &amp; Market Reports
            </h2>
          </div>
          <Link to="/blog" className="Reports-browseLink group">
            <span>Browse All Articles</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="Reports-grid">
          {reportsData.map((report) => (
            <div key={report.id} className="Reports-card group">
              <div className="Reports-imageContainer">
                <img
                  src={report.image}
                  alt={report.title}
                  className="Reports-image group-hover:scale-105 transition-transform duration-500"
                />
                <span className="Reports-tagBadge">{report.tag}</span>
              </div>
              <div className="Reports-content">
                <span className="Reports-date">{report.date}</span>
                <h3 className="Reports-cardTitle group-hover:text-primary transition-colors">{report.title}</h3>
                <p className="Reports-cardDesc">{report.desc}</p>
                <div className="Reports-footer">
                  <Link to="/blog" className="Reports-readLink">
                    <span>Read Analysis</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reports;
