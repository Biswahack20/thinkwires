import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SkillSearchInput from '../common/SkillSearchInput';
import {
  setActiveSpecialty,
  setActiveUrgency,
  setActiveNoticePeriod,
  setActiveExperience,
  setActiveLocation,
  setSortBy,
  setSearchQuery,
} from '../../store/slices/benchSlice';

const BenchFilterBar = ({ totalCount }) => {
  const dispatch = useDispatch();
  const {
    specialtyFilters,
    filterOptions,
    activeSpecialty,
    activeUrgency,
    activeNoticePeriod,
    activeExperience,
    activeLocation,
    sortBy,
    searchQuery,
  } = useSelector((state) => state.bench);

  const defaultSpecialties = [
    { label: 'All Engineering', count: 142 },
    { label: 'GenAI & LLMs', count: 38 },
    { label: 'Cloud & DevOps', count: 31 },
    { label: 'SAP & Enterprise', count: 24 },
    { label: 'Systems & Distributed', count: 27 },
    { label: 'Data & Analytics', count: 22 },
  ];

  const specialties =
    specialtyFilters && specialtyFilters.length > 0
      ? specialtyFilters
      : defaultSpecialties;

  const defaultUrgency = [
    'All Urgency',
    'Immediate (24-48h)',
    'Within 1 Week',
    'Within 2 Weeks',
  ];
  const defaultNoticePeriods = [
    'All Notice Periods',
    'Immediate (48h)',
    'Within 7 Days',
    'Within 15 Days',
    '30 Days',
    'Immediate',
    '60 Days',
    '90 Days',
  ];
  const defaultExperience = [
    'All Experience',
    'Staff/Principal (10+y)',
    'Senior (6-9y)',
    'Lead (8+y)',
  ];
  const defaultLocations = [
    'All Locations',
    'US East / Hybrid',
    'US Remote',
    'EU Remote',
    'Global / Flexible',
  ];
  const defaultSorts = [
    'AI Assessment',
    'Highest Score',
    'Fastest Availability',
    'Lowest Rate',
  ];

  const urgencyList = filterOptions?.urgency || defaultUrgency;
  const noticePeriodList = filterOptions?.noticePeriod || defaultNoticePeriods;
  const experienceList = filterOptions?.experience || defaultExperience;
  const locationList = filterOptions?.locations || defaultLocations;
  const sortList = filterOptions?.sortOptions || defaultSorts;

  return (
    <div className="BenchFilter-wrapper">
      {/* Search Input & Primary Console Header */}
      <div className="BenchFilter-searchBar">
        <div className="BenchFilter-searchInputWrapper">
          <span className="material-symbols-outlined BenchFilter-searchIcon">
            search
          </span>
          <SkillSearchInput
            id="bench-search-input"
            className="BenchFilter-searchInput"
            placeholder="Search by role, stack (e.g. LangChain, Kubernetes, Go), or TW-BENCH code..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onSelect={(skill) => dispatch(setSearchQuery(skill))}
          />
          {searchQuery && (
            <button
              type="button"
              className="BenchFilter-clearBtn"
              onClick={() => dispatch(setSearchQuery(''))}
              title="Clear search"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        <div className="BenchFilter-activeCounter">
          <span className="BenchFilter-counterBadge">{totalCount}</span>
          <span className="BenchFilter-counterText">Talents Available Now</span>
        </div>
      </div>

      {/* Specialty Filter Pills */}
      <div className="BenchFilter-specialtyPills">
        {specialties.map((item, idx) => {
          const isActive = activeSpecialty === item.label;
          return (
            <button
              key={idx}
              type="button"
              className={`BenchFilter-pill ${isActive ? 'is-active' : ''}`}
              onClick={() => dispatch(setActiveSpecialty(item.label))}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="BenchFilter-pillBadge">{item.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Notice Period Toggles (Issue #166) */}
      <div className="BenchFilter-quickTogglesRow">
        <span className="BenchFilter-quickTogglesLabel">
          <span className="material-symbols-outlined">bolt</span>
          <span>Fast Deployment:</span>
        </span>
        <div className="BenchFilter-quickTogglesGroup">
          {[
            { label: 'Immediate (48h)', icon: 'bolt' },
            { label: 'Within 7 Days', icon: 'speed' },
            { label: 'Within 15 Days', icon: 'calendar_today' },
          ].map((item) => {
            const isActive = activeNoticePeriod === item.label;
            return (
              <button
                key={item.label}
                type="button"
                className={`BenchFilter-quickToggleBtn ${isActive ? 'is-active' : ''}`}
                onClick={() =>
                  dispatch(
                    setActiveNoticePeriod(
                      isActive ? 'All Notice Periods' : item.label
                    )
                  )
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Dropdown Filter Bar */}
      <div className="BenchFilter-dropdownRow">
        <div className="BenchFilter-dropdownGroup">
          <div className="BenchFilter-selectField">
            <label htmlFor="bench-filter-urgency" className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">schedule</span>{' '}
              Urgency:
            </label>
            <select
              id="bench-filter-urgency"
              aria-label="Filter candidates by deployment urgency"
              value={activeUrgency}
              onChange={(e) => dispatch(setActiveUrgency(e.target.value))}
              className="BenchFilter-select"
            >
              {urgencyList.map((u, i) => (
                <option key={i} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="BenchFilter-selectField">
            <label htmlFor="bench-filter-notice-period" className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">hourglass_top</span>{' '}
              Notice Period:
            </label>
            <select
              id="bench-filter-notice-period"
              value={activeNoticePeriod}
              onChange={(e) => dispatch(setActiveNoticePeriod(e.target.value))}
              className="BenchFilter-select"
              aria-label="Filter candidates by notice period"
            >
              {noticePeriodList.map((np, i) => (
                <option key={i} value={np}>
                  {np}
                </option>
              ))}
            </select>
          </div>

          <div className="BenchFilter-selectField">
            <label htmlFor="bench-filter-experience" className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">
                workspace_premium
              </span>{' '}
              Experience:
            </label>
            <select
              id="bench-filter-experience"
              aria-label="Filter candidates by experience tier"
              value={activeExperience}
              onChange={(e) => dispatch(setActiveExperience(e.target.value))}
              className="BenchFilter-select"
            >
              {experienceList.map((exp, i) => (
                <option key={i} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          <div className="BenchFilter-selectField">
            <label htmlFor="bench-filter-location" className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">public</span>{' '}
              Location:
            </label>
            <select
              id="bench-filter-location"
              aria-label="Filter candidates by location"
              value={activeLocation}
              onChange={(e) => dispatch(setActiveLocation(e.target.value))}
              className="BenchFilter-select"
            >
              {locationList.map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="BenchFilter-sortField">
          <label htmlFor="bench-filter-sort-by" className="BenchFilter-selectLabel">
            <span className="material-symbols-outlined">sort</span> Sort by:
          </label>
          <select
            id="bench-filter-sort-by"
            aria-label="Sort candidates by criteria"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="BenchFilter-select BenchFilter-selectSort"
          >
            {sortList.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BenchFilterBar;
