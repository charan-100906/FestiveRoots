import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Eye, EyeOff, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminFestivalsPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', approximateMonth: '', image: '' });
  const [message, setMessage] = useState(null);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/festivals/admin/all');
      if (res.data.success) {
        setFestivals(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  const openAddModal = () => {
    setEditingFestival(null);
    setFormData({ name: '', description: '', approximateMonth: '', image: '' });
    setModalOpen(true);
  };

  const openEditModal = (fest) => {
    setEditingFestival(fest);
    setFormData({
      name: fest.name,
      description: fest.description || '',
      approximateMonth: fest.approximateMonth || '',
      image: fest.image || ''
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const res = await api.delete(`/festivals/${id}`);
      if (res.data.success) {
        setFestivals(festivals.map((f) => (f._id === id ? { ...f, isActive: !currentActive } : f)));
        setMessage({ type: 'success', text: `Festival ${!currentActive ? 'activated' : 'deactivated'} successfully` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update festival status' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFestival) {
        const res = await api.put(`/festivals/${editingFestival._id}`, formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Festival updated successfully' });
          fetchFestivals();
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/festivals', formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: `New Festival "${res.data.data.name}" registered in MongoDB! It is now instantly available for artisan product linking and customer filtering.` });
          fetchFestivals();
          setModalOpen(false);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save festival' });
    }
  };

  return (
    <div className="admin-festivals-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Dynamic Festivals Manager</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Add new cultural celebrations into MongoDB. Newly added festivals appear automatically in product forms and filter tabs.
            </p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">
            <PlusCircle size={16} /> Add New Festival
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
                    <th style={{ padding: '0.75rem 0.5rem' }}>Festival</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Approx. Timing</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Description</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {festivals.map((fest) => (
                    <tr key={fest._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src={fest.image || 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=800&q=80'} alt={fest.name} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                          <span>{fest.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {fest.approximateMonth || 'Festive Season'}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)', maxWidth: '300px' }}>
                        {fest.description}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: fest.isActive ? 'var(--color-success)' : 'var(--color-text-light)' }}>
                          {fest.isActive ? '● Active' : '○ Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(fest)}
                            className="btn btn-sm btn-outline"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(fest._id, fest.isActive)}
                            className="btn btn-sm btn-outline"
                          >
                            {fest.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
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

      {/* Add / Edit Festival Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-maroon)' }}>
              {editingFestival ? `Edit Festival: ${editingFestival.name}` : 'Register New Festival in Database'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Festival Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Navratri & Dussehra"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Approximate Calendar Period</label>
                <input
                  type="text"
                  value={formData.approximateMonth}
                  onChange={(e) => setFormData({ ...formData, approximateMonth: e.target.value })}
                  placeholder="e.g. September / October"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Significance of this festival and traditional crafts associated with it..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Festival Image Web URL</label>
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
                  {editingFestival ? 'Save Changes' : 'Save Festival to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFestivalsPage;
