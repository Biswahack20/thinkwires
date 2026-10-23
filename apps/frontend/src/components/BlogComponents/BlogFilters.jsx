import React from 'react';
import { CloseIcon } from '../../admin/AdminIcons';

const DEFAULT_CATEGORIES = [
  { key: 'all', label: 'All Insights' },
  { key: 'AI & Tech Trends', label: 'AI & Tech Trends' },
  { key: 'GCC Economics', label: 'GCC Economics' },
  { key: 'Talent Strategy', label: 'Talent Strategy' },
  { key: 'Case Studies', label: 'Case Studies' },
];

const BlogFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalResults,
  totalArticles,
}) => {
  const allCount = totalArticles !== undefined ? totalArticles : totalResults;
  const categories = DEFAULT_CATEGORIES.map((cat) =>
    cat.key === 'all'
      ? { ...cat, label: `All Insights (${allCount || 0})` }
      : cat
  );

  return (
    <div className="BlogFilters-figmaBar blog-container">
      {/* Category Pills on Left */}
      <div className="BlogFilters-figmaPillsGroup">
        {categories.map((cat) => {
          const isActive =
            selectedCategory === cat.key ||
            (cat.key === 'all' &&
              (selectedCategory === 'all' ||
                selectedCategory === 'All' ||
                selectedCategory === 'All Insights' ||
                selectedCategory.startsWith('All Insights')));

          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`BlogFilters-figmaPillBtn ${isActive ? 'is-active' : ''}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search Input on Right */}
      <div className="BlogFilters-figmaSearchWrapper">
        <svg
          className="BlogFilters-figmaSearchIcon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="BlogFilters-figmaSearchInput"
          placeholder="Filter insights & keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="BlogFilters-figmaClearBtn"
            aria-label="Clear search"
          >
            <CloseIcon size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogFilters;
