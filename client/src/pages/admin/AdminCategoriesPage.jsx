import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Layers } from 'lucide-react';
import api from '../../services/api';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '', sortOrder: 0 });
  const [message, setMessage] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/admin/all');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '', sortOrder: categories.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      sortOrder: cat.sortOrder || 0
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        setCategories(categories.map((c) => (c._id === id ? { ...c, isActive: !currentActive } : c)));
        setMessage({ type: 'success', text: `Category ${!currentActive ? 'activated' : 'deactivated'} successfully` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update category status' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await api.put(`/categories/${editingCategory._id}`, formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Category updated successfully' });
          fetchCategories();
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/categories', formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: `New Category "${res.data.data.name}" added to MongoDB! It is now instantly selectable by artisans and in customer filters.` });
          fetchCategories();
          setModalOpen(false);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save category' });
    }
  };

  return (
    <div className="admin-categories-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Dynamic Categories Manager</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Add and edit craft categories stored in MongoDB. Changes immediately reflect in artisan forms and customer filters without redeployment.
            </p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">
            <PlusCircle size={16} /> Add New Category
          </button>
        </div>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-light)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Slug</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Description</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src={cat.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80'} alt={cat.name} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                        {cat.slug}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)', maxWidth: '320px' }}>
                        {cat.description}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: cat.isActive ? 'var(--color-success)' : 'var(--color-text-light)' }}>
                          {cat.isActive ? '● Active' : '○ Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="btn btn-sm btn-outline"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(cat._id, cat.isActive)}
                            className="btn btn-sm btn-outline"
                            title={cat.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-maroon)' }}>
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Craft Category'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eco-Friendly Handmade Gifts"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of crafts falling under this category..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Representative Image Web URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Save Changes' : 'Create Category in MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
