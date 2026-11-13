import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillSearchInput from '../common/SkillSearchInput';
import CustomSelect from '../common/CustomSelect';

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations (India / US / Remote)' },
  { value: 'bangalore', label: 'Bangalore Hub' },
  { value: 'remote', label: 'Remote / Borderless' },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'chennai', label: 'Chennai / Pune' },
  { value: 'noida', label: 'Noida (HQ)' },
];

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any Seniority' },
  { value: '3-5', label: 'Mid-Senior (3 - 5 Years)' },
  { value: '8-12', label: 'Lead / Specialist (8 - 12 Years)' },
  { value: '15', label: 'Staff / Principal Architect (15+ Years)' },
];

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

        <CustomSelect
          id="talent-search-location"
          name="location"
          label="Location"
          icon="location_on"
          value={locationInput}
          onChange={setLocationInput}
          options={LOCATION_OPTIONS}
          fieldClassName="NewHero-searchFieldLocation"
        />

        <CustomSelect
          id="talent-search-experience"
          name="experience"
          label="Experience"
          icon="layers"
          value={experienceInput}
          onChange={setExperienceInput}
          options={EXPERIENCE_OPTIONS}
          fieldClassName="NewHero-searchFieldExp"
        />

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
