import React, { useState } from 'react';
import { FolderIcon, TrashIcon, CloseIcon } from './AdminIcons';

// Helper to convert camelCase to Title Case (e.g., 'featureComparison' -> 'Feature Comparison')
const formatKeyName = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Recursive field renderer based on value type
const FieldRenderer = ({ path, label, value, onChange, onRemove }) => {
  const isLongText =
    typeof value === 'string' &&
    (value.length > 70 ||
      value.includes('\n') ||
      /desc|description|subtitle|summary|notes|body|message|text/i.test(label));

  if (typeof value === 'string') {
    return (
      <div className="tw-form-group" style={{ marginBottom: '0.85rem' }}>
        <label
          className="tw-form-label"
          style={{
            fontSize: '0.78rem',
            marginBottom: '0.25rem',
            color: '#334155',
          }}
        >
          {label}
        </label>
        {isLongText ? (
          <textarea
            className="tw-form-textarea"
            rows={Math.min(4, Math.max(2, Math.ceil(value.length / 80)))}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.65rem' }}
          />
        ) : (
          <input
            type="text"
            className="tw-form-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
          />
        )}
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className="tw-form-group" style={{ marginBottom: '0.85rem' }}>
        <label
          className="tw-form-label"
          style={{
            fontSize: '0.78rem',
            marginBottom: '0.25rem',
            color: '#334155',
          }}
        >
          {label}
        </label>
        <input
          type="number"
          className="tw-form-input"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
        />
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div
        style={{
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <input
          type="checkbox"
          id={path.join('.')}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            width: '16px',
            height: '16px',
            accentColor: '#008F68',
            cursor: 'pointer',
          }}
        />
        <label
          htmlFor={path.join('.')}
          style={{
            fontSize: '0.82rem',
            color: '#334155',
            fontWeight: 600,
            cursor: 'pointer',
            margin: 0,
          }}
        >
          {label}
        </label>
      </div>
    );
  }

  // Primitive collections (e.g. string tags, bullet items)
  if (
    Array.isArray(value) &&
    (value.length === 0 || typeof value[0] !== 'object')
  ) {
    const handleItemChange = (idx, newVal) => {
      const copy = [...value];
      copy[idx] = newVal;
      onChange(copy);
    };

    const handleAddItem = () => {
      onChange([...value, '']);
    };

    const handleRemoveItem = (idx) => {
      onChange(value.filter((_, i) => i !== idx));
    };

    return (
      <div
        style={{
          marginBottom: '1rem',
          backgroundColor: '#F8FAFC',
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
          }}
        >
          <label
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#334155',
              margin: 0,
            }}
          >
            {label} ({value.length} items)
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            style={{
              background: '#E6F4F0',
              border: '1px solid #B8E2D6',
              color: '#008F68',
              borderRadius: '4px',
              padding: '0.15rem 0.5rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Item
          </button>
        </div>

        {value.map((item, idx) => (
          <div
            key={idx}
            style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}
          >
            <input
              type="text"
              className="tw-form-input"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              placeholder={`Item #${idx + 1}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              style={{
                background: 'none',
                border: 'none',
                color: '#DC2626',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0 0.35rem',
              }}
              title="Remove item"
            >
              <CloseIcon size={14} color="#DC2626" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Structured record collections (cards, FAQs, milestones)
  if (Array.isArray(value) && typeof value[0] === 'object') {
    const handleCardChange = (idx, subKey, newVal) => {
      const copy = [...value];
      copy[idx] = { ...copy[idx], [subKey]: newVal };
      onChange(copy);
    };

    const handleAddCard = () => {
      // Generate template based on first item structure
      const template = {};
      if (value[0]) {
        Object.keys(value[0]).forEach((k) => {
          template[k] = typeof value[0][k] === 'number' ? 0 : '';
        });
      } else {
        template.title = '';
        template.desc = '';
      }
      onChange([...value, template]);
    };

    const handleRemoveCard = (idx) => {
      onChange(value.filter((_, i) => i !== idx));
    };

    return (
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}
          >
            {label} ({value.length} entries)
          </span>
          <button
            type="button"
            onClick={handleAddCard}
            style={{
              backgroundColor: '#008F68',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Entry
          </button>
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
        >
          {value.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.75rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  borderBottom: '1px dashed #E2E8F0',
                  paddingBottom: '0.35rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#64748B',
                  }}
                >
                  #{idx + 1}{' '}
                  {item.title ||
                    item.name ||
                    item.year ||
                    item.question ||
                    `Card`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCard(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <TrashIcon size={12} color="#DC2626" />
                  <span>Remove</span>
                </button>
              </div>

              {Object.keys(item).map((k) => (
                <FieldRenderer
                  key={k}
                  path={[...path, idx, k]}
                  label={formatKeyName(k)}
                  value={item[k]}
                  onChange={(newVal) => handleCardChange(idx, k, newVal)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Nested composite object groups
  if (typeof value === 'object' && value !== null) {
    const handleSubFieldChange = (subKey, newVal) => {
      onChange({
        ...value,
        [subKey]: newVal,
      });
    };

    return (
      <div
        style={{
          marginBottom: '1rem',
          padding: '0.85rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#0F172A',
            marginBottom: '0.65rem',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '0.35rem',
          }}
        >
          {label}
        </div>
        {Object.keys(value).map((subKey) => (
          <FieldRenderer
            key={subKey}
            path={[...path, subKey]}
            label={formatKeyName(subKey)}
            value={value[subKey]}
            onChange={(newVal) => handleSubFieldChange(subKey, newVal)}
          />
        ))}
      </div>
    );
  }

  return null;
};

// Main Visual Section Editor Component
const VisualSectionEditor = ({ data = {}, onChange }) => {
  const [openSections, setOpenSections] = useState({});
  const [filterQuery, setFilterQuery] = useState('');

  const keys = Object.keys(data || {});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSectionChange = (sectionKey, newSectionValue) => {
    onChange({
      ...data,
      [sectionKey]: newSectionValue,
    });
  };

  const filteredKeys = keys.filter(
    (k) =>
      k.toLowerCase().includes(filterQuery.toLowerCase()) ||
      formatKeyName(k).toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (keys.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#64748B',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          border: '1px dashed #CBD5E1',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          This page currently has no structured section payload. Click below to
          add a common layout section.
        </p>
        <button
          type="button"
          onClick={() =>
            onChange({
              hero: {
                title: 'Welcome',
                subtitle: 'Leading Tech Workforce Solutions',
                badge: 'Enterprise Tier',
              },
              stats: { metric1: '98%', metric2: '500+ Engineers' },
            })
          }
          style={{
            marginTop: '0.75rem',
            backgroundColor: '#008F68',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '5px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Initialize Hero & Stats Sections
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Search Filter for Sections */}
      {keys.length > 3 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <input
            type="text"
            className="tw-form-input"
            placeholder="Filter sections (e.g., hero, feature, points)..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.65rem' }}
          />
        </div>
      )}

      {/* Accordion Panels for Each Top-Level Section */}
      {filteredKeys.map((secKey) => {
        const isOpen = openSections[secKey] !== false; // default open
        const sectionValue = data[secKey];
        const label = formatKeyName(secKey);

        return (
          <div
            key={secKey}
            style={{
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header Accordion Bar */}
            <div
              onClick={() => toggleSection(secKey)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 0.9rem',
                backgroundColor: isOpen ? '#F1F5F9' : '#FFFFFF',
                cursor: 'pointer',
                userSelect: 'none',
                borderBottom: isOpen ? '1px solid #E2E8F0' : 'none',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FolderIcon size={16} open={isOpen} color="#008F68" />
                <strong style={{ fontSize: '0.86rem', color: '#0F172A' }}>
                  {label}
                </strong>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#64748B',
                    fontFamily: 'monospace',
                  }}
                >
                  ({secKey})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {isOpen ? '▲ Collapse' : '▼ Edit Section'}
              </span>
            </div>

            {/* Section Content Form */}
            {isOpen && (
              <div style={{ padding: '0.9rem' }}>
                <FieldRenderer
                  path={[secKey]}
                  label={label}
                  value={sectionValue}
                  onChange={(newVal) => handleSectionChange(secKey, newVal)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VisualSectionEditor;
