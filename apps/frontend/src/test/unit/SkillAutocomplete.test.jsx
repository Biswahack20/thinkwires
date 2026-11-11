/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { searchSkills, SKILLS_TAXONOMY } from '../../data/skillsData';
import SkillTagInput from '../../components/common/SkillTagInput';
import SkillSearchInput from '../../components/common/SkillSearchInput';

describe('Technical Skills Taxonomy & Autocomplete Engine', () => {
  describe('searchSkills search algorithm', () => {
    it('contains over 100 classified skills with valid categories', () => {
      expect(SKILLS_TAXONOMY.length).toBeGreaterThan(100);
      SKILLS_TAXONOMY.forEach((skill) => {
        expect(skill.name).toBeTruthy();
        expect(skill.category).toBeTruthy();
      });
    });

    it('returns prefix matches on a single letter', () => {
      const results = searchSkills('r', 10);
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.name.toLowerCase());
      // Should include top R skills like React, Redis, Rust, etc.
      expect(names.some((n) => n.startsWith('r'))).toBe(true);
    });

    it('finds word boundary matches (e.g. "sql" finds PostgreSQL)', () => {
      const results = searchSkills('sql', 10);
      const names = results.map((r) => r.name);
      expect(names).toContain('PostgreSQL');
    });

    it('omits already selected skills from suggestions', () => {
      const resultsWithoutSelected = searchSkills('react', 5, ['React']);
      const names = resultsWithoutSelected.map((r) => r.name);
      expect(names).not.toContain('React');
    });

    it('handles empty or blank input gracefully', () => {
      expect(searchSkills('')).toEqual([]);
      expect(searchSkills('   ')).toEqual([]);
      expect(searchSkills(null)).toEqual([]);
    });

    it('strictly respects the limit parameter', () => {
      const results = searchSkills('a', 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe('SkillTagInput Component', () => {
    it('renders initial skills passed as comma-separated string', () => {
      render(
        <SkillTagInput
          value="React, Node.js, AWS"
          onChange={() => {}}
        />
      );

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    it('renders initial skills passed as array', () => {
      render(
        <SkillTagInput
          value={['Python', 'Django']}
          onChange={() => {}}
        />
      );

      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Django')).toBeInTheDocument();
    });

    it('opens suggestion dropdown on single character typed', () => {
      render(
        <SkillTagInput
          value=""
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'k' } });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText(/suggested skills/i)).toBeInTheDocument();
    });

    it('adds selected suggestion when clicked', () => {
      const handleChange = vi.fn();
      render(
        <SkillTagInput
          value="AWS"
          onChange={handleChange}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'docker' } });

      const suggestionItem = screen.getByText('Docker');
      fireEvent.mouseDown(suggestionItem);

      expect(handleChange).toHaveBeenCalledWith('AWS, Docker');
    });

    it('allows adding a custom skill via Enter key', () => {
      const handleChange = vi.fn();
      render(
        <SkillTagInput
          value="React"
          onChange={handleChange}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.change(input, { target: { value: 'CustomFramework' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleChange).toHaveBeenCalledWith('React, CustomFramework');
    });

    it('removes skill when clicking the remove button', () => {
      const handleChange = vi.fn();
      render(
        <SkillTagInput
          value="React, Python"
          onChange={handleChange}
        />
      );

      const removeBtn = screen.getByRole('button', { name: /remove react/i });
      fireEvent.click(removeBtn);

      expect(handleChange).toHaveBeenCalledWith('Python');
    });

    it('removes last skill on Backspace when input is empty', () => {
      const handleChange = vi.fn();
      render(
        <SkillTagInput
          value="React, Go"
          onChange={handleChange}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.keyDown(input, { key: 'Backspace' });

      expect(handleChange).toHaveBeenCalledWith('React');
    });
  });

  describe('SkillSearchInput Component', () => {
    it('shows suggestions dropdown when user types single letter', () => {
      render(
        <SkillSearchInput
          value="p"
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByText(/matching technologies/i)).toBeInTheDocument();
    });

    it('invokes onSelect when a suggestion is clicked', () => {
      const handleSelect = vi.fn();
      render(
        <SkillSearchInput
          value="kub"
          onChange={() => {}}
          onSelect={handleSelect}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);

      const option = screen.getByRole('option');
      fireEvent.mouseDown(option);

      expect(handleSelect).toHaveBeenCalledWith('Kubernetes');
    });

    it('closes suggestions dropdown on Escape key', () => {
      render(
        <SkillSearchInput
          value="g"
          onChange={() => {}}
        />
      );

      const input = screen.getByRole('combobox');
      fireEvent.focus(input);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(input, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
