import React from 'react';

const BlogPagination = ({
  currentPage = 1,
  totalItems = 15,
  itemsPerPage = 6,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 2;

  return (
    <div className="BlogPagination-figmaContainer">
      <div className="BlogPagination-figmaSummary">
        Showing <strong>{Math.min(itemsPerPage, totalItems)}</strong> of <strong>{totalItems}</strong> verified engineering reports
      </div>

      <div className="BlogPagination-figmaControls">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="BlogPagination-figmaArrowBtn"
          aria-label="Previous Page"
        >
          ‹
        </button>

        <div className="BlogPagination-figmaPages">
          {[1, 2].map((page) => (
            <button
              key={page}
              onClick={() => onPageChange && onPageChange(page)}
              className={`BlogPagination-figmaPageBtn ${currentPage === page ? 'is-active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="BlogPagination-figmaArrowBtn"
          aria-label="Next Page"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default BlogPagination;
