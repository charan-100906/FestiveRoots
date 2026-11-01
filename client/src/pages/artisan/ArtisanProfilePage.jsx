import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const ArtisanProfilePage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    craftSpecialization: '',
    state: '',
    district: '',
    townVillage: '',
    bio: '',
    claimedTraditionHistory: '',
    phone: '',
    profileImage: ''
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/artisans/me/profile');
        if (res.data.success) {
          const p = res.data.data;
          setProfile(p);
          setFormData({
            businessName: p.businessName || '',
            craftSpecialization: p.craftSpecialization || '',
            state: p.state || '',
            district: p.district || '',
            townVillage: p.townVillage || '',
            bio: p.bio || '',
            claimedTraditionHistory: p.claimedTraditionHistory || '',
            phone: p.phone || '',
            profileImage: p.profileImage || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage(null);
      const res = await api.put('/artisans/me/profile', formData);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Workshop profile updated successfully' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  return (
    <div className="artisan-profile-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container container-narrow" style={{ maxWidth: '720px' }}>
        <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem' }}>Workshop Profile Details</h1>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Keep your regional craft story and workshop contact details updated.
              </p>
            </div>
            {profile?.verificationStatus === 'VERIFIED' && (
              <span className="heritage-pill" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                <ShieldCheck size={14} /> Certified Artisan
              </span>
            )}
          </div>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1.5rem' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Workshop / Guild Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Craft Specialization</label>
              <input
                type="text"
                name="craftSpecialization"
                value={formData.craftSpecialization}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Town or Village</label>
                <input
                  type="text"
                  name="townVillage"
                  value={formData.townVillage}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Artisan Biography</label>
              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="form-textarea"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Generational Tradition & Craft Heritage Lineage</label>
              <textarea
                name="claimedTraditionHistory"
                rows="3"
                value={formData.claimedTraditionHistory}
                onChange={handleChange}
                className="form-textarea"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image Web URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfilePage;
