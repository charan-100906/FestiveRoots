import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Eye, EyeOff, MapPin } from 'lucide-react';
import api from '../../services/api';

const AdminRegionsPage = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    townVillage: '',
    craftHeritage: '',
    description: '',
    image: ''
  });
  const [message, setMessage] = useState(null);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/regions/admin/all');
      if (res.data.success) {
        setRegions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const openAddModal = () => {
    setEditingRegion(null);
    setFormData({ state: '', district: '', townVillage: '', craftHeritage: '', description: '', image: '' });
    setModalOpen(true);
  };

  const openEditModal = (reg) => {
    setEditingRegion(reg);
    setFormData({
      state: reg.state,
      district: reg.district,
      townVillage: reg.townVillage || '',
      craftHeritage: reg.craftHeritage || '',
      description: reg.description || '',
      image: reg.image || ''
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const res = await api.delete(`/regions/${id}`);
      if (res.data.success) {
        setRegions(regions.map((r) => (r._id === id ? { ...r, isActive: !currentActive } : r)));
        setMessage({ type: 'success', text: `Region ${!currentActive ? 'activated' : 'deactivated'} successfully` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update region status' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRegion) {
        const res = await api.put(`/regions/${editingRegion._id}`, formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Region cluster updated successfully' });
          fetchRegions();
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/regions', formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: `New Region Cluster "${res.data.data.district}, ${res.data.data.state}" registered in MongoDB!` });
          fetchRegions();
          setModalOpen(false);
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save region' });
    }
  };

  return (
    <div className="admin-regions-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Dynamic Regions & Craft Clusters Manager</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Configure states, districts, and indigenous craft traditions for regional storytelling and filtering.
            </p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">
            <PlusCircle size={16} /> Register New Region Cluster
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
                    <th style={{ padding: '0.75rem 0.5rem' }}>Region / Location</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>State</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Craft Heritage Lineage</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((reg) => (
                    <tr key={reg._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img src={reg.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'} alt={reg.district} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                          <span>{reg.district} {reg.townVillage ? `(${reg.townVillage})` : ''}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>{reg.state}</td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                        {reg.craftHeritage}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: reg.isActive ? 'var(--color-success)' : 'var(--color-text-light)' }}>
                          {reg.isActive ? '● Active' : '○ Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(reg)}
                            className="btn btn-sm btn-outline"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(reg._id, reg.isActive)}
                            className="btn btn-sm btn-outline"
                          >
                            {reg.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
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

      {/* Add / Edit Region Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--color-maroon)' }}>
              {editingRegion ? `Edit Region: ${editingRegion.district}` : 'Register New Craft Region Cluster'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Rajasthan"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">District *</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Jaipur"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Town or Village (Optional)</label>
                <input
                  type="text"
                  value={formData.townVillage}
                  onChange={(e) => setFormData({ ...formData, townVillage: e.target.value })}
                  placeholder="e.g. Kot Jewar"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Craft Heritage Lineage *</label>
                <input
                  type="text"
                  value={formData.craftHeritage}
                  onChange={(e) => setFormData({ ...formData, craftHeritage: e.target.value })}
                  placeholder="e.g. Glazed Quartz Blue Pottery & Sanganeri Hand Block Printing"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Heritage Story</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Geographical context, local materials, and master artisan history..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Image Web URL</label>
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
                  {editingRegion ? 'Save Changes' : 'Save Region Cluster to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegionsPage;
