import React from 'react';
import Skeleton from './Skeleton';
import './skeleton.css';

/**
 * Skeleton Loader matching Thinkwires Featured Flagship Paper Layout
 *
 * @param {Object} props
 * @param {string} [props.className] - Optional extra class
 */
export const FeaturedArticleSkeleton = ({ className = '' }) => {
  return (
    <section
      className={`tw-skeleton-featured-card ${className}`}
      role="status"
      aria-busy="true"
      aria-label="Loading featured flagship research..."
    >
      {/* Left Column: Image with Overlays */}
      <div style={{ position: 'relative', width: '100%', minHeight: '340px' }}>
        <Skeleton variant="rounded" width="100%" height="100%" style={{ minHeight: '340px' }} />
      </div>

      {/* Right Column: Article Details */}
      <div className="tw-skeleton-featured-content">
        {/* Categories Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Skeleton variant="rounded" width={115} height={24} />
          <Skeleton variant="rounded" width={95} height={24} />
          <Skeleton variant="rounded" width={105} height={24} />
        </div>

        {/* Flagship Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Skeleton variant="text" width="95%" height={32} />
          <Skeleton variant="text" width="80%" height={32} />
        </div>

        {/* Excerpt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="96%" height={16} />
          <Skeleton variant="text" width="70%" height={16} />
        </div>

        {/* Primary Finding Callout */}
        <div className="tw-skeleton-featured-callout">
          <Skeleton variant="text" width={140} height={14} />
          <Skeleton variant="text" width="95%" height={16} />
        </div>

        {/* Author Metadata & Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Skeleton variant="circular" width={42} height={42} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Skeleton variant="text" width={140} height={16} />
              <Skeleton variant="text" width={100} height={13} />
            </div>
          </div>
          <Skeleton variant="rounded" width={140} height={42} />
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticleSkeleton;

