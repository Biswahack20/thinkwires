import React, { useState, useEffect, useRef, useMemo } from 'react';
import { searchSkills } from '../../data/skillsData';
import './skills.css';

/**
 * SkillSearchInput: Search bar input with instant typeahead suggestions dropdown.
 * Used for filtering by skill/tech stack in Bench, Jobs, and Admin views.
 * Features:
 * - Instant suggestions on 1st character typed
 * - Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
 * - Highlights matched substring
 * - Category badges
 * - Zero emojis
 */
const SkillSearchInput = ({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search by skill, stack, or keyword...',
  id = 'skill-search-input',
  name,
  className = '',
  wrapperClassName = '',
  ariaLabel = 'Search skills or keyword',
  disabled = false,
  autoFocus = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const cleanQuery = typeof value === 'string' ? value : '';

  // Suggestions derived from cleanQuery
  const suggestions = useMemo(() => {
    if (!cleanQuery || !cleanQuery.trim()) return [];
    return searchSkills(cleanQuery, 8);
  }, [cleanQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSkill = (skillName) => {
    if (onSelect) {
      onSelect(skillName);
    } else if (onChange) {
      onChange(skillName);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (onChange) onChange(e);
    setIsOpen(val.trim().length > 0);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        return;
      }
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
      return;
    }

    if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelectSkill(suggestions[highlightedIndex].name);
      } else {
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
  };

  const renderHighlighted = (text, query) => {
    if (!query || !query.trim()) return text;
    const qLower = query.trim().toLowerCase();
    const tLower = text.toLowerCase();
    const matchIdx = tLower.indexOf(qLower);

    if (matchIdx === -1) return text;

    const before = text.slice(0, matchIdx);
    const match = text.slice(matchIdx, matchIdx + qLower.length);
    const after = text.slice(matchIdx + qLower.length);

    return (
      <>
        {before}
        <span className="tw-skill-highlight">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`tw-skill-search-wrap ${wrapperClassName}`}
    >
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        className={className}
        placeholder={placeholder}
        value={cleanQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (cleanQuery.trim().length > 0) setIsOpen(true);
        }}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        aria-label={ariaLabel}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && suggestions.length > 0}
        aria-controls={`${id}-suggestions`}
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          id={`${id}-suggestions`}
          className="tw-skill-search-dropdown"
          role="listbox"
        >
          <li className="tw-skill-dropdown-header">
            <span>Matching Technologies</span>
            <span>Click to filter</span>
          </li>
          {suggestions.map((item, idx) => (
            <li
              key={item.name}
              role="option"
              aria-selected={idx === highlightedIndex}
              className={`tw-skill-search-item ${
                idx === highlightedIndex ? 'is-active' : ''
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSkill(item.name);
              }}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              <span>{renderHighlighted(item.name, cleanQuery)}</span>
              <span className="tw-skill-category-badge">{item.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkillSearchInput;

