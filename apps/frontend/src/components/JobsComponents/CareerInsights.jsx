import React from 'react';
import { Link } from 'react-router-dom';

const CareerInsights = () => {
  const articles = [
    {
      id: 1,
      date: 'Sep 12, 2026',
      tag: 'Wellness',
      title: 'Supporting Employee Wellness and Work-Life Balance in Distributed...',
      snippet: 'Sustainable high performance depends on feeling healthy, respected, and empowered to deliver world-class code without burn-out.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      date: 'Jun 23, 2026',
      tag: 'Campus Drive',
      title: 'From Classroom to Career: Empowering 250+ Next-Gen Tech...',
      snippet: 'Recap of ThinkWires landmark hiring drive in Dehradun, selecting high-potential graduate talent across Cloud and Full-Stack cohorts.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      date: 'May 04, 2026',
      tag: 'Impact',
      title: 'CSR & Environmental Sustainability: Our Roadmap to 1,000 Planted Trees',
      snippet: 'Learn how our team combines cutting-edge engineering consulting with purposeful community initiatives in healthcare and rural...',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="CareerInsights-figmaSection">
      <div className="CareerInsights-figmaContainer">
        {/* Header Row */}
        <div className="CareerInsights-headerRow">
          <div className="CareerInsights-headerLeftCol">
            <div className="CareerInsights-knowledgeBadge">
              KNOWLEDGE BASE & TECH CULTURE
            </div>
            <h2 className="CareerInsights-headingTitle">
              Career Insights & Tech Culture
            </h2>
          </div>

          <div className="CareerInsights-headerRightCol">
            <Link to="/blog" className="CareerInsights-readAllLink">
              <span>Read All Articles</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="CareerInsights-cardsGrid">
          {articles.map((item) => (
            <article key={item.id} className="CareerInsights-articleCard">
              <div className="CareerInsights-imgWrapper">
                <img src={item.image} alt={item.title} className="CareerInsights-cardImg" />
              </div>

              <div className="CareerInsights-cardBody">
                <div className="CareerInsights-metaRow">
                  <span>{item.date}</span>
                  <span className="CareerInsights-dotSep">•</span>
                  <span className="CareerInsights-tagText">{item.tag}</span>
                </div>

                <h3 className="CareerInsights-articleTitle">{item.title}</h3>
                <p className="CareerInsights-articleSnippet">{item.snippet}</p>

                <div className="CareerInsights-readStoryRow">
                  <span className="CareerInsights-readStoryBtn">Read Story ›</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerInsights;
