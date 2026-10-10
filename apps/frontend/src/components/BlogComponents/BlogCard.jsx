import React from 'react';

const BlogCard = ({ article, onReadClick }) => {
  if (!article) return null;

  const telemetry = article.telemetry || {
    type: 'box-split',
    label1: 'CONVERSION GAP',
    value1: '1:47 Ratio',
    badgeLabel: 'Selective Bias',
    badgeValue: 'Specialized vs General',
    boxBg: '#f1f5f9',
  };

  return (
    <article className="FigmaBlogCard-container">
      {/* Top Badge & Read Time Header */}
      <div className="FigmaBlogCard-topRow">
        <span
          className="FigmaBlogCard-categoryPill"
          style={{
            backgroundColor: article.badgeBg || '#dbeafe',
            color: article.badgeColor || '#1e40af',
          }}
        >
          {article.badge || article.category}
        </span>
        <span className="FigmaBlogCard-readTime">
          ⏱ {article.readTime || '8 min read'}
        </span>
      </div>

      {/* Date & Sub-Category Row */}
      <div className="FigmaBlogCard-dateSubRow">
        <span>{article.publishedAt || 'Aug 26, 2026'}</span>
        <span className="FigmaBlogCard-dot">•</span>
        <span className="FigmaBlogCard-subCategory">{article.subCategory || 'Talent Benchmarks'}</span>
      </div>

      {/* Title */}
      <h3
        className="FigmaBlogCard-title"
        onClick={() => onReadClick && onReadClick(article)}
      >
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="FigmaBlogCard-excerpt">{article.excerpt}</p>

      {/* Dynamic Telemetry Box inside Card */}
      <div
        className="FigmaBlogCard-telemetryBox"
        style={{ backgroundColor: telemetry.boxBg || '#f8fafc' }}
      >
        {telemetry.type === 'progress-bar' ? (
          <div className="FigmaBlogCard-progressWrapper">
            <div className="FigmaBlogCard-progressHeader">
              <span className="FigmaBlogCard-telemetryLabel">{telemetry.label1}</span>
              <span className="FigmaBlogCard-telemetryValue">{telemetry.value1}</span>
            </div>
            <div className="FigmaBlogCard-progressBarBg">
              <div
                className="FigmaBlogCard-progressBarFill"
                style={{ width: telemetry.value1 || '72%' }}
              />
            </div>
          </div>
        ) : telemetry.type === 'chart-trend' ? (
          <div className="FigmaBlogCard-chartWrapper">
            <div>
              <div className="FigmaBlogCard-telemetryLabel">{telemetry.label1}</div>
              <div className="FigmaBlogCard-telemetryValue" style={{ color: '#ef4444' }}>
                {telemetry.value1}
              </div>
            </div>
            <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
              <path
                d="M2 22 L20 16 L40 10 L68 2"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : (
          <div className="FigmaBlogCard-splitWrapper">
            <div>
              <div className="FigmaBlogCard-telemetryLabel">{telemetry.label1}</div>
              <div className="FigmaBlogCard-telemetryValue">{telemetry.value1}</div>
            </div>
            {telemetry.badgeLabel && (
              <div className="FigmaBlogCard-rightPillBadge">
                <span className="FigmaBlogCard-rightPillTitle">{telemetry.badgeLabel}</span>
                <span className="FigmaBlogCard-rightPillSub">{telemetry.badgeValue}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Author Footer */}
      <div className="FigmaBlogCard-footer">
        <div className="FigmaBlogCard-authorGroup">
          {article.author?.avatar ? (
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="FigmaBlogCard-avatar"
            />
          ) : (
            <span className="FigmaBlogCard-initialsBubble">
              {article.author?.initials || 'TW'}
            </span>
          )}
          <span className="FigmaBlogCard-authorName">{article.author?.name}</span>
        </div>

        <button
          onClick={() => onReadClick && onReadClick(article)}
          className="FigmaBlogCard-readLink"
        >
          Read Analysis ›
        </button>
      </div>
    </article>
  );
};

export default BlogCard;
