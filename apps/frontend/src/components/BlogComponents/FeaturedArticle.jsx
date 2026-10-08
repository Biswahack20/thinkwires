import React from 'react';
import featuredImgAsset from '../../assets/blog_ai_gcc_dashboard.jpg';

const FeaturedArticle = ({ article, isBookmarked, onBookmarkToggle, onReadClick }) => {
  const defaultArticle = {
    id: 'featured-flagship-1',
    title: 'Beyond the Code: How Data Science and AI Are Engine-Building the New India',
    excerpt:
      "India's tech story is undergoing a fundamental structural pivot. The nation is shifting from being the back-office support system for global tech to becoming the primary engine for global R&D and indigenous AI innovations. Over the next five years, data science will evolve from passive business intelligence into an infrastructure-level driver of governance, industry, and economic mobility.",
    primaryFinding:
      'Global GCC capability share in tier-1 Indian centers rose from 24% maintenance to 68% high-order machine learning IP generation in 2026.',
    categories: [
      { name: 'AI & Data Science', bg: '#dbeafe', color: '#1e40af' },
      { name: 'GCC Trends', bg: '#f1f5f9', color: '#475569' },
      { name: 'Strategic Shift', bg: '#dcfce7', color: '#166534' },
    ],
    readTime: '12 min read',
    imageUrl: featuredImgAsset,
    author: {
      name: 'Research & Advisory Team',
      role: 'Macro Technology Practice',
    },
    publishedAt: 'Sep 16, 2026',
  };

  const currentArticle = article || defaultArticle;
  // Always prioritize local generated asset image over default remote urls
  const displayImage =
    currentArticle.imageUrl && !currentArticle.imageUrl.includes('unsplash')
      ? currentArticle.imageUrl
      : featuredImgAsset;

  const categoriesList = currentArticle.categories || [
    { name: 'AI & Data Science', bg: '#dbeafe', color: '#1e40af' },
    { name: 'GCC Trends', bg: '#f1f5f9', color: '#475569' },
    { name: 'Strategic Shift', bg: '#dcfce7', color: '#166534' },
  ];

  return (
    <section className="FeaturedArticle-section">
      <div className="FeaturedArticle-card blog-container">
        {/* Left Column: Fixed Image Container with Overlays */}
        <div className="FeaturedArticle-imageContainer">
          <img
            src={displayImage}
            alt={currentArticle.title}
            className="FeaturedArticle-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = featuredImgAsset;
            }}
          />
          <div className="FeaturedArticle-imageOverlay" />

          {/* Overlaid Badges Top Left */}
          <div className="FeaturedArticle-badgeOverlayGroup">
            <span className="FeaturedArticle-flagshipBadge">
              FEATURED FLAGSHIP PAPER
            </span>
            <span className="FeaturedArticle-timeBadge">
              {currentArticle.readTime || '12 min read'}
            </span>
          </div>

          {/* Bottom Left Author Glass Overlay */}
          <div className="FeaturedArticle-authorOverlayBottomLeft">
            <div className="FeaturedArticle-authorIconBadge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
              </svg>
            </div>
            <div className="FeaturedArticle-authorOverlayText">
              <span className="FeaturedArticle-authorOverlayName">
                {currentArticle.author?.name || 'Research & Advisory Team'}
              </span>
              <span className="FeaturedArticle-authorOverlayRole">
                {currentArticle.author?.role || 'Macro Technology Practice'}
              </span>
            </div>
          </div>

          {/* Bottom Right Date Overlay */}
          <div className="FeaturedArticle-dateOverlayBottomRight">
            {currentArticle.publishedAt || 'Sep 16, 2026'}
          </div>
        </div>

        {/* Right Column: Category Pills, Title, Paragraph, Primary Finding Box, CTA */}
        <div className="FeaturedArticle-content">
          <div className="FeaturedArticle-categoryPillsGroup">
            {categoriesList.map((cat, idx) => (
              <span
                key={idx}
                className="FeaturedArticle-pillTag"
                style={{
                  backgroundColor: cat.bg || '#dbeafe',
                  color: cat.color || '#1e40af',
                }}
              >
                {cat.name || cat}
              </span>
            ))}
          </div>

          <h2
            className="FeaturedArticle-title"
            onClick={() => onReadClick && onReadClick(currentArticle)}
          >
            {currentArticle.title}
          </h2>

          <p className="FeaturedArticle-excerpt">{currentArticle.excerpt}</p>

          {/* Primary Finding Callout Box */}
          <div className="FeaturedArticle-findingBox">
            <div className="FeaturedArticle-findingHeader">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span>Primary Finding</span>
            </div>
            <p className="FeaturedArticle-findingText">
              {currentArticle.primaryFinding ||
                'Global GCC capability share in tier-1 Indian centers rose from 24% maintenance to 68% high-order machine learning IP generation in 2026.'}
            </p>
          </div>

          {/* Footer Action Buttons */}
          <div className="FeaturedArticle-actionRow">
            <button
              onClick={() => onReadClick && onReadClick(currentArticle)}
              className="FeaturedArticle-readReportBtn"
            >
              <span>Read Full Report</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <button
              onClick={() => onBookmarkToggle && onBookmarkToggle(currentArticle.id)}
              className={`FeaturedArticle-bookmarkSquareBtn ${isBookmarked ? 'is-active' : ''}`}
              aria-label="Bookmark report"
              title={isBookmarked ? 'Remove Bookmark' : 'Save Report'}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
