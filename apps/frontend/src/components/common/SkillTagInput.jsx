import React, { useState, useEffect, useRef, useMemo } from 'react';
import { searchSkills } from '../../data/skillsData';
import './skills.css';

/**
 * SkillTagInput: Interactive tokenized chip input for technical skills.
 * Features:
 * - Single-letter instant suggestion dropdown
 * - Keyboard navigation (Arrows, Enter, Backspace, Escape)
 * - Freeform custom skill entry
 * - Dual format support (comma-separated string or array)
 * - Zero emojis
 */
const SkillTagInput = ({
  value = '',
  onChange,
  placeholder = 'Type a skill (e.g. React, Python, AWS)...',
  id,
  name,
  disabled = false,
  maxSkills,
  className = '',
  style,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize incoming value into string array
  const currentSkills = useMemo(() => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map((s) => String(s).trim());
    }
    if (typeof value === 'string' && value.trim()) {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [value]);

  // Compute suggestions based on current input text
  const suggestions = useMemo(() => {
    if (!inputValue || !inputValue.trim()) return [];
    return searchSkills(inputValue, 8, currentSkills);
  }, [inputValue, currentSkills]);

  // Close dropdown on click outside
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

  const emitChange = (newSkills) => {
    if (!onChange) return;
    if (Array.isArray(value)) {
      onChange(newSkills);
    } else {
      onChange(newSkills.join(', '));
    }
  };

  const addSkill = (skillName) => {
    const clean = String(skillName || '').trim();
    if (!clean) return;

    // Check duplicates (case-insensitive)
    const exists = currentSkills.some(
      (s) => s.toLowerCase() === clean.toLowerCase()
    );
    if (exists) {
      setInputValue('');
      setIsOpen(false);
      return;
    }

    if (maxSkills && currentSkills.length >= maxSkills) {
      setInputValue('');
      setIsOpen(false);
      return;
    }

    const updated = [...currentSkills, clean];
    emitChange(updated);
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  const removeSkill = (indexToRemove) => {
    if (disabled) return;
    const updated = currentSkills.filter((_, idx) => idx !== indexToRemove);
    emitChange(updated);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    // If user types a comma, treat as delimiter
    if (val.includes(',')) {
      const parts = val.split(',');
      const toAdd = parts[0].trim();
      if (toAdd) addSkill(toAdd);
      setInputValue('');
      return;
    }
    setInputValue(val);
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
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        addSkill(suggestions[highlightedIndex].name);
      } else if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
      return;
    }

    if (e.key === 'Backspace' && !inputValue && currentSkills.length > 0) {
      removeSkill(currentSkills.length - 1);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
  };

  // Helper to render matched substring with highlight
  const renderHighlightedText = (text, query) => {
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
      className={`tw-skill-tag-input-wrap ${className}`}
      style={style}
    >
      <div
        className={`tw-skill-tag-box ${disabled ? 'is-disabled' : ''}`}
        onClick={() => inputRef.current && inputRef.current.focus()}
      >
        {currentSkills.map((skill, idx) => (
          <span key={`${skill}-${idx}`} className="tw-skill-chip">
            <span>{skill}</span>
            {!disabled && (
              <button
                type="button"
                className="tw-skill-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkill(idx);
                }}
                aria-label={`Remove ${skill}`}
                title={`Remove ${skill}`}
              >
                &times;
              </button>
            )}
          </span>
        ))}

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          className="tw-skill-input-field"
          placeholder={currentSkills.length === 0 ? placeholder : 'Add more...'}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim().length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={id ? `${id}-suggestions` : 'skill-suggestions'}
        />
      </div>

      {isOpen && (
        <ul
          id={id ? `${id}-suggestions` : 'skill-suggestions'}
          className="tw-skill-dropdown"
          role="listbox"
        >
          {suggestions.length > 0 && (
            <li className="tw-skill-dropdown-header">
              <span>Suggested Skills ({suggestions.length})</span>
              <span>Select or press Enter</span>
            </li>
          )}

          {suggestions.map((item, idx) => (
            <li
              key={item.name}
              role="option"
              aria-selected={idx === highlightedIndex}
              className={`tw-skill-suggestion-item ${
                idx === highlightedIndex ? 'is-active' : ''
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                addSkill(item.name);
              }}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              <div className="tw-skill-item-main">
                <span>{renderHighlightedText(item.name, inputValue)}</span>
              </div>
              <span className="tw-skill-category-badge">{item.category}</span>
            </li>
          ))}

          {inputValue.trim() && (
            <li
              className="tw-skill-custom-add-hint"
              onMouseDown={(e) => {
                e.preventDefault();
                addSkill(inputValue.trim());
              }}
              style={{ cursor: 'pointer' }}
            >
              <span>Add custom skill: </span>
              <strong>&ldquo;{inputValue.trim()}&rdquo;</strong>
              <span className="tw-skill-custom-add-key">Enter</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SkillTagInput;

