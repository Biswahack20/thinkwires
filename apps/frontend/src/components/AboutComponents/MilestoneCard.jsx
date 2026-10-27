import React from 'react';

/**
 * Reusable MilestoneCard component for Thinkwires Growth & Evolution 2x2 grid.
 *
 * @param {Object} props
 * @param {Object} props.item Milestone data object from mockdata.json
 * @param {string} props.item.id Unique identifier
 * @param {string|number} props.item.year Milestone year (e.g., "2022", "2026+")
 * @param {string} props.item.tag Category label (e.g., "Founding", "Cross-Border")
 * @param {string} props.item.title Milestone heading
 * @param {string} props.item.description Detailed milestone description
 * @param {string} [props.item.status] Status string ('completed' | 'planned')
 * @param {string} [props.item.variant] Optional variant indicator
 * @param {boolean} [props.isFuture] Force future visual state flag
 */
const MilestoneCard = ({ item, isFuture: propIsFuture }) => {
  if (!item) return null;

  const isFuture =
    propIsFuture ??
    (item.status === 'planned' ||
      item.variant === 'future' ||
      String(item.year).includes('+'));

  const statusLabel = isFuture ? 'Planned Initiative' : 'Achieved';

  return (
    <article
      className={`MilestoneCard ${isFuture ? 'MilestoneCard--future' : ''}`}
      aria-label={`${item.year} Milestone: ${item.title}`}
    >
      {/* Top row: Year & Category Tag */}
      <div className="MilestoneCard-top">
        <time
          className="MilestoneCard-year"
          dateTime={String(item.year).replace('+', '')}
        >
          {item.year}
        </time>

        <span
          className="MilestoneCard-tag"
          aria-label={`Category: ${item.tag}`}
        >
          {item.tag}
        </span>
      </div>

      {/* Milestone Heading */}
      <h3 className="MilestoneCard-title">{item.title}</h3>

      {/* Description */}
      <p className="MilestoneCard-desc">{item.description}</p>

      {/* Subtle Bottom Status Indicator */}
      <div className="MilestoneCard-footer">
        <span
          className={`MilestoneCard-status ${
            isFuture
              ? 'MilestoneCard-status--planned'
              : 'MilestoneCard-status--achieved'
          }`}
          aria-label={`Status: ${statusLabel}`}
        >
          <span className="MilestoneCard-statusDot" aria-hidden="true" />
          <span className="MilestoneCard-statusText">{statusLabel}</span>
        </span>
      </div>
    </article>
  );
};

export default MilestoneCard;
