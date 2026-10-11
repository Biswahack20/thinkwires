import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveSpecialty,
  setActiveUrgency,
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

  const specialties = specialtyFilters && specialtyFilters.length > 0 ? specialtyFilters : defaultSpecialties;

  const defaultUrgency = ['All Urgency', 'Immediate (24-48h)', 'Within 1 Week', 'Within 2 Weeks'];
  const defaultExperience = ['All Experience', 'Staff/Principal (10+y)', 'Senior (6-9y)', 'Lead (8+y)'];
  const defaultLocations = ['All Locations', 'US East / Hybrid', 'US Remote', 'EU Remote', 'Global / Flexible'];
  const defaultSorts = ['Highest Score', 'Fastest Availability', 'Lowest Rate'];

  const urgencyList = filterOptions?.urgency || defaultUrgency;
  const experienceList = filterOptions?.experience || defaultExperience;
  const locationList = filterOptions?.locations || defaultLocations;
  const sortList = filterOptions?.sortOptions || defaultSorts;

  return (
    <div className="BenchFilter-wrapper">
      {/* Search Input & Primary Console Header */}
      <div className="BenchFilter-searchBar">
        <div className="BenchFilter-searchInputWrapper">
          <span className="material-symbols-outlined BenchFilter-searchIcon">search</span>
          <input
            type="text"
            className="BenchFilter-searchInput"
            placeholder="Search by role, stack (e.g. LangChain, Kubernetes, Go), or TW-BENCH code..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
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

      {/* Secondary Dropdown Filter Bar */}
      <div className="BenchFilter-dropdownRow">
        <div className="BenchFilter-dropdownGroup">
          <div className="BenchFilter-selectField">
            <label className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">schedule</span> Urgency:
            </label>
            <select
              value={activeUrgency}
              onChange={(e) => dispatch(setActiveUrgency(e.target.value))}
              className="BenchFilter-select"
            >
              {urgencyList.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="BenchFilter-selectField">
            <label className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">workspace_premium</span> Experience:
            </label>
            <select
              value={activeExperience}
              onChange={(e) => dispatch(setActiveExperience(e.target.value))}
              className="BenchFilter-select"
            >
              {experienceList.map((exp, i) => (
                <option key={i} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          <div className="BenchFilter-selectField">
            <label className="BenchFilter-selectLabel">
              <span className="material-symbols-outlined">public</span> Location:
            </label>
            <select
              value={activeLocation}
              onChange={(e) => dispatch(setActiveLocation(e.target.value))}
              className="BenchFilter-select"
            >
              {locationList.map((loc, i) => (
                <option key={i} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="BenchFilter-sortField">
          <label className="BenchFilter-selectLabel">
            <span className="material-symbols-outlined">sort</span> Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="BenchFilter-select BenchFilter-selectSort"
          >
            {sortList.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BenchFilterBar;
