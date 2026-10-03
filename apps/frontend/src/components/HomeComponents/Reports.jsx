import React from 'react';

const Reports = () => {
  const reportsData = [
    {
      id: 1,
      tag: 'AI & Data Science',
      date: 'September 16, 2026',
      title: 'Beyond the Code: How Data Science and AI...',
      desc: "India's AI ecosystem is rapidly evolving. We explore how leading organizations are structuring their data teams and the back-end architectures driving them.",
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      tag: 'Hiring Trends',
      date: 'August 24, 2026',
      title: "India's IT Job Market in 2026: Hiring Is...",
      desc: 'Despite global headwinds, specialized engineering roles remain in high demand. See our comprehensive analysis on salary trends and retention strategies.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      tag: 'HR Technology',
      date: 'August 01, 2026',
      title: 'AI Recruitment in 2026: Smarter Matches, Longer Wait Times?',
      desc: 'While automated screening and technical code evaluations have increased efficiency, average time-to-hire has shifted by 11 days due to multi-stage vetting.',
      image:
        'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className={'Reports-section'}>
      <div className={'Reports-container'}>
        <div className={'Reports-header'}>
          <div className={'Reports-headerLeft'}>
            <span className={'Reports-subtitle'}>TALENT ADVISORY INSIGHTS</span>
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
