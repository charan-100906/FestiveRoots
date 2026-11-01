import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ArtisanRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    craftSpecialization: '',
    state: '',
    district: '',
    townVillage: '',
    bio: '',
    claimedTraditionHistory: '',
    profileImage: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  const { registerArtisan } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await registerArtisan(formData);

      if (res.success) {
        setSuccessSubmitted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Artisan registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successSubmitted) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '650px' }}>
        <div className="card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', background: '#FFFFFF' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏺</div>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-maroon)', marginBottom: '0.75rem' }}>
            Application Submitted for Verification!
          </h2>
          <div className="heritage-pill" style={{ marginBottom: '1.25rem' }}>
            Status: PENDING ADMINISTRATIVE REVIEW
          </div>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Thank you, <b>{formData.name}</b>. Your artisan profile for <b>{formData.businessName || formData.craftSpecialization}</b> in <b>{formData.district}, {formData.state}</b> has been received. Our regional coordinators will review your craft credentials. You can access your artisan dashboard to begin preparing your product drafts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/artisan/dashboard" className="btn btn-primary btn-lg">
              Go to Artisan Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-register-page" style={{ padding: '4rem 0 6rem' }}>
      <div className="container container-narrow" style={{ maxWidth: '680px' }}>
        <div className="card" style={{ padding: '3rem 2.5rem', background: '#FFFFFF' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={13} /> Artisan Partnership Program
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Register as a Traditional Artisan</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
              Showcase your regional handicrafts to conscious customers across India.
            </p>
          </div>

          <div className="alert alert-info" style={{ marginBottom: '1.75rem' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <span>
              All artisan applications undergo verification by platform administrators to ensure genuine regional craftsmanship.
            </span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', marginBottom: '1rem' }}>
              1. Craftsman & Workshop Identity
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Artisan Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Varma"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Workshop / Guild Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Kondapalli Softwood Craft Guild"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Craft Specialization *</label>
              <input
                type="text"
                name="craftSpecialization"
                value={formData.craftSpecialization}
                onChange={handleChange}
                placeholder="e.g. Softwood Carving, Terracotta Pottery, Blue Pottery, Dokra Casting"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Account Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="artisan@festiveroots.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98480 12345"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Account Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', margin: '1.75rem 0 1rem' }}>
              2. Regional Cluster Location
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Andhra Pradesh"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Krishna"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Town or Village *</label>
                <input
                  type="text"
                  name="townVillage"
                  value={formData.townVillage}
                  onChange={handleChange}
                  placeholder="e.g. Kondapalli"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', margin: '1.75rem 0 1rem' }}>
              3. Craft Heritage & Biography
            </h3>

            <div className="form-group">
              <label className="form-label">Artisan Biography *</label>
              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share your artisan journey, how many generations your family has practiced this craft, and your workshop values..."
                className="form-textarea"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Claimed Generational Lineage & Craft History</label>
              <textarea
                name="claimedTraditionHistory"
                rows="3"
                value={formData.claimedTraditionHistory}
                onChange={handleChange}
                placeholder="Describe the regional or folklore roots of this craft (e.g. 400-year-old royal patronages, indigenous wood turning techniques)..."
                className="form-textarea"
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Workshop Profile Photo URL (Optional)</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {loading ? 'Submitting Registration...' : 'Submit Artisan Profile for Verification'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-light)', fontSize: '0.86rem', color: 'var(--color-text-muted)' }}>
            Already an approved artisan? <Link to="/login" style={{ color: 'var(--color-terracotta)', fontWeight: 600 }}>Sign in to workshop portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanRegisterPage;
