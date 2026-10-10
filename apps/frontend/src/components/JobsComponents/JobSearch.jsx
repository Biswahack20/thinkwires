import React from 'react';

const JobSearch = ({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  experienceFilter,
  setExperienceFilter,
  workMode,
  setWorkMode,
  sortBy,
  setSortBy,
  totalResults,
  onSearchSubmit
}) => {
  const workModes = ['All Modes', 'Remote', 'Hybrid', 'On-site'];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit();
  };

  return (
    <div className="JobSearch-floatingCard">
      <form onSubmit={handleFormSubmit} className="JobSearch-searchForm">
        {/* Row 1: Search Inputs Grid */}
        <div className="JobSearch-inputsRow">
          {/* Keyword Input */}
          <div className="JobSearch-fieldWithIcon JobSearch-keywordField">
            <svg className="JobSearch-inputIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="JobSearch-nativeInput"
              placeholder="Skill, role or stack (e.g. SAP, AEM, Cloud, C..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="JobSearch-clearBtn" 
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Location Selector */}
          <div className="JobSearch-fieldWithIcon JobSearch-selectField">
            <svg className="JobSearch-inputIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <select
              className="JobSearch-nativeSelect"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="All">All Locations (Global & India)</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="India">India</option>
              <option value="Europe">Europe & Remote</option>
            </select>
          </div>

          {/* Experience Selector */}
          <div className="JobSearch-fieldWithIcon JobSearch-selectField">
            <svg className="JobSearch-inputIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <select
              className="JobSearch-nativeSelect"
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <option value="All">All Experience Tiers</option>
              <option value="Junior">1 - 3 Years (Junior)</option>
              <option value="Mid">3 - 5 Years (Mid-Level)</option>
              <option value="Senior">5 - 8 Years (Senior)</option>
              <option value="Lead">8+ Years (Lead / Principal)</option>
            </select>
          </div>

          {/* Search Submit Button */}
          <button type="submit" className="JobSearch-submitButton">
            <span>Search</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Row 2: Work Mode Pills & Status Bar */}
        <div className="JobSearch-subFiltersRow">
          {/* Work Mode Filter Pills */}
          <div className="JobSearch-workModeGroup">
            <span className="JobSearch-workModeLabel">WORK MODE:</span>
            <div className="JobSearch-modePillsList">
              {workModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`JobSearch-modePill ${workMode === mode ? 'JobSearch-activeModePill' : ''}`}
                  onClick={() => setWorkMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Right Status Indicator & Sorting */}
          <div className="JobSearch-statusSortGroup">
            <div className="JobSearch-rolesCounter">
              <span className="JobSearch-greenDot">⚡</span>
              <span className="JobSearch-rolesCountText">
                <strong>{totalResults}</strong> Open Tech Roles
              </span>
            </div>

            <div className="JobSearch-sortInline">
              <span className="JobSearch-sortLabel">Sort:</span>
              <select
                className="JobSearch-sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest First">Newest First</option>
                <option value="Highest Salary">Highest Salary</option>
                <option value="Title A-Z">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobSearch;
