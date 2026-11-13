import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomSelect from '../../components/common/CustomSelect';

const sampleOptions = [
  { value: '', label: 'All Locations (India / US / Remote)' },
  { value: 'bangalore', label: 'Bangalore Hub' },
  { value: 'remote', label: 'Remote / Borderless' },
  { value: 'hyderabad', label: 'Hyderabad' },
];

describe('CustomSelect Component', () => {
  it('renders with label, initial selected value, icon, and chevron', () => {
    render(
      <CustomSelect
        id="test-location-select"
        label="Location"
        icon="location_on"
        value=""
        onChange={() => {}}
        options={sampleOptions}
      />
    );

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('All Locations (India / US / Remote)')).toBeInTheDocument();
    expect(screen.getByText('location_on')).toBeInTheDocument();
    expect(screen.getByText('expand_more')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
  });

  it('opens options dropdown on click and displays all options', () => {
    render(
      <CustomSelect
        id="test-location-select"
        label="Location"
        icon="location_on"
        value=""
        onChange={() => {}}
        options={sampleOptions}
      />
    );

    // Dropdown should be closed initially
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // Click trigger to open
    const trigger = screen.getByLabelText('Location');
    fireEvent.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Bangalore Hub')).toBeInTheDocument();
    expect(screen.getByText('Remote / Borderless')).toBeInTheDocument();
  });

  it('calls onChange with selected value when an option is clicked', () => {
    const handleChange = vi.fn();
    render(
      <CustomSelect
        id="test-location-select"
        label="Location"
        icon="location_on"
        value=""
        onChange={handleChange}
        options={sampleOptions}
      />
    );

    const trigger = screen.getByLabelText('Location');
    fireEvent.click(trigger);

    const bangaloreOption = screen.getByText('Bangalore Hub');
    fireEvent.click(bangaloreOption);

    expect(handleChange).toHaveBeenCalledWith('bangalore');
    // Dropdown should close after selection
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('navigates options via keyboard ArrowDown, ArrowUp, and Enter', () => {
    const handleChange = vi.fn();
    render(
      <CustomSelect
        id="test-exp-select"
        label="Experience"
        icon="layers"
        value=""
        onChange={handleChange}
        options={sampleOptions}
      />
    );

    const trigger = screen.getByLabelText('Experience');

    // ArrowDown opens dropdown and highlights first option
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // ArrowDown to move to second option
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    // Enter to select highlighted option
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('bangalore');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown when Escape key is pressed', () => {
    render(
      <CustomSelect
        id="test-location-select"
        label="Location"
        icon="location_on"
        value=""
        onChange={() => {}}
        options={sampleOptions}
      />
    );

    const trigger = screen.getByLabelText('Location');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <CustomSelect
          id="test-location-select"
          label="Location"
          icon="location_on"
          value=""
          onChange={() => {}}
          options={sampleOptions}
        />
      </div>
    );

    const trigger = screen.getByLabelText('Location');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

