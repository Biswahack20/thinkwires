import React, { useState, useEffect, useRef } from 'react';

/**
 * CustomSelect: Modern accessible dropdown component replacing default HTML selects.
 * Matches Thinkwires design system:
 * - Clean light lavender container with smooth hover & focus states
 * - Left icon alignment
 * - Right vertically centered chevron with smooth rotation animation
 * - Clean white popover with elevation shadow, rounded corners, and blue hover/selected states
 * - Fully accessible (ARIA roles, keyboard navigation, click-outside handling)
 */
const CustomSelect = ({
  id,
  name,
  label,
  icon,
  value = '',
  onChange,
  options = [],
  placeholder = '',
  className = '',
  fieldClassName = '',
  ariaLabel,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on outside click
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

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption
    ? selectedOption.label
    : placeholder || options[0]?.label || '';

  const handleSelect = (val) => {
    if (disabled) return;
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        const currIdx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currIdx >= 0 ? currIdx : 0);
        return;
      }
      setHighlightedIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        const currIdx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currIdx >= 0 ? currIdx : options.length - 1);
        return;
      }
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1
      );
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && options[highlightedIndex]) {
        handleSelect(options[highlightedIndex].value);
      } else {
        setIsOpen((prev) => !prev);
        const currIdx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(currIdx >= 0 ? currIdx : 0);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (e.key === 'Tab') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleContainerClick = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`NewHero-searchField NewHero-searchFieldSelect ${fieldClassName} ${
        isOpen ? 'is-open is-focused' : ''
      } ${disabled ? 'is-disabled' : ''} ${className}`}
      onClick={handleContainerClick}
    >
      {icon && (
        <span
          className="material-symbols-outlined NewHero-searchIcon"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <div className="NewHero-inputBlock">
        {label && (
          <label
            htmlFor={id}
            className="NewHero-fieldLabel"
            onClick={(e) => e.stopPropagation()}
          >
            {label}
          </label>
        )}

        <button
          ref={buttonRef}
          type="button"
          id={id}
          className="NewHero-customSelectTrigger"
          aria-label={ariaLabel || label}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-menu`}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            const val = e?.target?.value ?? e;
            handleSelect(val);
          }}
        >
          <span className="NewHero-customSelectValue">{displayLabel}</span>
        </button>
      </div>

      <div
        className={`NewHero-chevronWrapper ${isOpen ? 'is-open' : ''}`}
        aria-hidden="true"
      >
        <span className="material-symbols-outlined NewHero-chevronIcon">
          expand_more
        </span>
      </div>

      {/* Hidden input for HTML form integration */}
      <input type="hidden" name={name || id} value={value} />

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          id={`${id}-menu`}
          role="listbox"
          aria-label={label}
          className="NewHero-customSelectMenu"
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === highlightedIndex;
            return (
              <li
                key={opt.value ?? idx}
                role="option"
                aria-selected={isSelected}
                className={`NewHero-customSelectOption ${
                  isSelected ? 'is-selected' : ''
                } ${isHighlighted ? 'is-highlighted' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                <span className="NewHero-customSelectOptionText">
                  {opt.label}
                </span>
                {isSelected && (
                  <span
                    className="material-symbols-outlined NewHero-customSelectCheck"
                    aria-hidden="true"
                  >
                    check
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;

