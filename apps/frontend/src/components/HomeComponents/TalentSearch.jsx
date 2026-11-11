import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillSearchInput from '../common/SkillSearchInput';

const TalentSearch = ({ onSearch }) => {
  const navigate = useNavigate();
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = {
      role: roleInput.trim(),
      location: locationInput,
      experience: experienceInput,
    };

    if (onSearch) {
      onSearch(query);
      return;
    }

    const params = new URLSearchParams();
    if (roleInput.trim()) params.append('search', roleInput.trim());
    if (locationInput) params.append('location', locationInput);
    if (experienceInput) params.append('experience', experienceInput);

    navigate({
      pathname: '/bench',
      search: params.toString() ? `?${params.toString()}` : '',
    });
  };

  return (
    <div className="NewHero-searchContainer">
      <form className="NewHero-searchForm" onSubmit={handleSubmit}>
        <div className="NewHero-searchField NewHero-searchFieldRole">
          <span className="material-symbols-outlined NewHero-searchIcon">
            search
          </span>
          <div className="NewHero-inputBlock">
            <label htmlFor="talent-search-role" className="NewHero-fieldLabel">
              Role or Skill
            </label>
            <SkillSearchInput
              id="talent-search-role"
              className="NewHero-fieldInput"
              wrapperClassName="NewHero-skillSearchWrap"
              placeholder="e.g. React, Python, AWS, SAP..."
              ariaLabel="Role or Skill"
              value={roleInput}
              onChange={(e) =>
                setRoleInput(typeof e === 'string' ? e : e.target.value)
              }
              onSelect={(skill) => setRoleInput(skill)}
            />
          </div>
        </div>

        <div className="NewHero-searchField NewHero-searchFieldLocation">
          <span className="material-symbols-outlined NewHero-searchIcon">
            location_on
          </span>
          <div className="NewHero-inputBlock">
            <label
              htmlFor="talent-search-location"
              className="NewHero-fieldLabel"
            >
              Location
            </label>
            <select
              id="talent-search-location"
              className="NewHero-fieldSelect"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            >
              <option value="">All Locations (India / US / Remote)</option>
              <option value="bangalore">Bangalore Hub</option>
              <option value="remote">Remote / Borderless</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai / Pune</option>
              <option value="noida">Noida (HQ)</option>
            </select>
          </div>
        </div>

        <div className="NewHero-searchField NewHero-searchFieldExp">
          <span className="material-symbols-outlined NewHero-searchIcon">
            layers
          </span>
          <div className="NewHero-inputBlock">
            <label
              htmlFor="talent-search-experience"
              className="NewHero-fieldLabel"
            >
              Experience
            </label>
            <select
              id="talent-search-experience"
              className="NewHero-fieldSelect"
              value={experienceInput}
              onChange={(e) => setExperienceInput(e.target.value)}
            >
              <option value="">Any Seniority</option>
              <option value="3-5">Mid-Senior (3 - 5 Years)</option>
              <option value="8-12">Lead / Specialist (8 - 12 Years)</option>
              <option value="15">
                Staff / Principal Architect (15+ Years)
              </option>
            </select>
          </div>
        </div>

        <div className="NewHero-searchAction">
          <button type="submit" className="NewHero-searchBtn">
            <span className="material-symbols-outlined">search</span>
            <span>Find Matches</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TalentSearch;
