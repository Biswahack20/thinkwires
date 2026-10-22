import React from 'react';
import { CloseIcon } from '../../admin/AdminIcons';

const categories = [
  'All Insights (15)',
  'AI & Tech Trends',
  'GCC Economics',
  'Talent Strategy',
  'Case Studies',
];

const BlogFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalResults,
}) => {
  return (
    <div className="BlogFilters-figmaBar blog-container">
      {/* Category Pills on Left */}
      <div className="BlogFilters-figmaPillsGroup">
        {categories.map((cat) => {
          const isActive =
            selectedCategory === cat ||
            (cat.startsWith('All Insights') &&
              (selectedCategory === 'All' ||
                selectedCategory === 'All Insights (15)'));

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`BlogFilters-figmaPillBtn ${isActive ? 'is-active' : ''}`}
            >
              {cat}
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
