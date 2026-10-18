import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adminApi } from './adminService';
import {
  SearchIcon,
  StarIcon,
  EditIcon,
  TrashIcon,
  CloseIcon,
  CodeIcon,
} from './AdminIcons';

const CATEGORIES = [
  'All',
  'Cloud & Infrastructure',
  'DevOps & Cloud Native',
  'Modern Fullstack & AI',
  'ERP & Enterprise Core',
  'Data & Analytics',
  'Security & Compliance',
  'Other',
];

const TechStackManager = () => {
  const { showToast, activeRole } = useOutletContext();
  const [techStacks, setTechStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStack, setEditingStack] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Cloud & Infrastructure',
    icon: 'hub',
    order: 1,
    isFeatured: true,
    isActive: true,
  });

  const [formError, setFormError] = useState('');

  const fetchTechStacks = () => {
    setLoading(true);
    adminApi
      .getCmsTechStacks({ search, category: selectedCategory })
      .then((res) => {
        setTechStacks(res.techstacks || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        showToast(`Failed to load tech stacks: ${err.message}`);
      });
  };

  useEffect(() => {
    fetchTechStacks();
  }, [search, selectedCategory]);

  const openAddModal = () => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot add technologies.');
      return;
    }
    setEditingStack(null);
    setFormData({
      name: '',
      category: 'Cloud & Infrastructure',
      icon: 'layers',
      order: techStacks.length + 1,
      isFeatured: true,
      isActive: true,
    });
    setFormError('');
    setEditorOpen(true);
  };

  const openEditModal = (item) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot edit technologies.');
      return;
    }
    setEditingStack(item);
    setFormData({
      name: item.name,
      category: item.category || 'Cloud & Infrastructure',
      icon: item.icon || 'layers',
      order: item.order || 1,
      isFeatured: item.isFeatured !== undefined ? item.isFeatured : true,
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setFormError('');
    setEditorOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Technology name is required.');
      return;
    }

    const payload = {
      ...formData,
      order: Number(formData.order) || 1,
    };

    if (editingStack) {
      adminApi
        .updateCmsTechStack(editingStack.slug || editingStack._id, payload)
        .then(() => {
          showToast(`Updated '${formData.name}' successfully!`);
          setEditorOpen(false);
          fetchTechStacks();
        })
        .catch((err) => setFormError(err.message));
    } else {
      adminApi
        .createCmsTechStack(payload)
        .then(() => {
          showToast(`Created technology badge '${formData.name}'!`);
          setEditorOpen(false);
          fetchTechStacks();
        })
        .catch((err) => setFormError(err.message));
    }
  };

  const handleToggleFeatured = (item) => {
    if (activeRole === 'viewer') {
      showToast('Viewer accounts cannot toggle marquee status.');
      return;
    }
    const targetId = item.slug || item._id;
    adminApi
      .toggleCmsTechStackFeatured(targetId)
      .then((res) => {
        showToast(
          res.isFeatured
            ? `Enabled '${item.name}' for homepage marquee carousel!`
            : `Hidden '${item.name}' from homepage marquee.`
        );
        fetchTechStacks();
      })
      .catch((err) => showToast(`Toggle failed: ${err.message}`));
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    adminApi
      .deleteCmsTechStack(deleteConfirmId)
      .then(() => {
        showToast('Technology badge deleted.');
        setDeleteConfirmId(null);
        fetchTechStacks();
      })
      .catch((err) => {
        showToast(`Deletion failed: ${err.message}`);
        setDeleteConfirmId(null);
      });
  };

  return (
    <div>
      {/* View Header */}
      <div className="tw-view-header">
        <div className="tw-view-title-group">
          <h1>Technology Stack Catalog (CMS)</h1>
          <p className="tw-view-subtitle">
            Curate enterprise technology badges displayed in the homepage animated marquee carousel and used for job requirements and candidate skills vetting.
          </p>
        </div>

        <button className="tw-btn-primary" onClick={openAddModal}>
          + Add Technology Badge
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="tw-filter-bar">
        <div className="tw-search-input-wrap">
          <SearchIcon size={16} color="#64748B" className="tw-search-icon" />
          <input
            type="text"
            className="tw-search-input"
            placeholder="Search by technology name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Category:</label>
          <select
            className="tw-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tech Cards Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          Loading technology badges from MongoDB...
        </div>
      ) : techStacks.length === 0 ? (
        <div className="tw-table-container" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          No technologies matched your filters.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {techStacks.map((item) => (
            <div
              key={item.slug || item._id}
              className="tw-chart-card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#E6F4F0',
                        color: '#008F68',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                    >
                      <CodeIcon size={18} color="#008F68" />
                    </span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#172033', fontWeight: 600 }}>
                        {item.name}
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>slug: /{item.slug}</span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  >
                    #{item.order || 0}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#EBF3FE',
                      color: '#3478D4',
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: '0.75rem',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  onClick={() => handleToggleFeatured(item)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    color: item.isFeatured ? '#16A34A' : '#94A3B8',
                    fontWeight: 600,
                  }}
                  title="Toggle display in public homepage marquee"
                >
                  <StarIcon size={14} filled={item.isFeatured} color={item.isFeatured ? '#16A34A' : '#94A3B8'} />
                  {item.isFeatured ? 'Marquee Active' : 'Hidden'}
                </button>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className="tw-btn-action"
                    onClick={() => openEditModal(item)}
                    title="Edit Technology"
                  >
                    <EditIcon size={14} />
                  </button>
                  <button
                    className="tw-btn-action danger"
                    onClick={() => setDeleteConfirmId(item.slug || item._id)}
                    title="Delete Technology"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {editorOpen && (
        <div className="tw-modal-backdrop">
          <div className="tw-modal" style={{ maxWidth: '480px' }}>
            <div className="tw-modal-header">
              <h2>{editingStack ? 'Edit Technology Badge' : 'Add Technology Badge'}</h2>
              <button className="tw-modal-close" onClick={() => setEditorOpen(false)}>
                <CloseIcon size={16} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="tw-form-group">
                <label className="tw-label">Technology Brand Name *</label>
                <input
                  type="text"
                  className="tw-input"
                  required
                  placeholder="e.g., Snowflake, Kubernetes, SAP S/4HANA"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="tw-form-group">
                <label className="tw-label">Category *</label>
                <select
                  className="tw-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="tw-form-group">
                  <label className="tw-label">Material Icon / Tag</label>
                  <input
                    type="text"
                    className="tw-input"
                    placeholder="e.g., cloud, hub, code"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>

                <div className="tw-form-group">
                  <label className="tw-label">Display Priority Order</label>
                  <input
                    type="number"
                    className="tw-input"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  Featured in Homepage Marquee
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Active Status
                </label>
              </div>

              <div className="tw-modal-footer">
                <button type="button" className="tw-btn-secondary" onClick={() => setEditorOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="tw-btn-primary">
                  {editingStack ? 'Save Changes' : 'Create Technology Badge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="tw-modal-backdrop">
          <div className="tw-modal" style={{ maxWidth: '420px' }}>
            <div className="tw-modal-header">
              <h2>Confirm Deletion</h2>
              <button className="tw-modal-close" onClick={() => setDeleteConfirmId(null)}>
                <CloseIcon size={16} />
              </button>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Are you sure you want to delete this technology badge? It will be removed from the homepage marquee and the skills inventory.
            </p>
            <div className="tw-modal-footer">
              <button className="tw-btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="tw-btn-danger" onClick={handleDelete}>
                Delete Technology
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackManager;
