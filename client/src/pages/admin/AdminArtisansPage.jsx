import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check, MapPin, Award, User, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const AdminArtisansPage = () => {
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModalArtisan, setRejectModalArtisan] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/artisans/pending');
      if (res.data.success) {
        setPendingArtisans(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (artisanId, name) => {
    try {
      setActionLoadingId(artisanId);
      setMessage(null);
      const res = await api.patch(`/admin/artisans/${artisanId}/verification`, {
        status: 'VERIFIED',
        verificationNotes: 'Verified under FestiveRoots Regional Artisan Standards.'
      });

      if (res.data.success) {
        setPendingArtisans(pendingArtisans.filter((a) => a._id !== artisanId));
        setMessage({ type: 'success', text: `Artisan "${name}" has been officially VERIFIED! Their products can now be certified.` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Verification failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalArtisan || !rejectionReason.trim()) return;

    try {
      setActionLoadingId(rejectModalArtisan._id);
      const res = await api.patch(`/admin/artisans/${rejectModalArtisan._id}/verification`, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim()
      });

      if (res.data.success) {
        setPendingArtisans(pendingArtisans.filter((a) => a._id !== rejectModalArtisan._id));
        setMessage({ type: 'success', text: `Artisan application for "${rejectModalArtisan.businessName}" marked as rejected.` });
        setRejectModalArtisan(null);
        setRejectionReason('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Rejection failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="admin-artisans-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Artisan Verification Queue</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Review artisan registrations, inspect village craft cluster claims, and grant official verification badges.
          </p>
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
        ) : pendingArtisans.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧑‍🎨</div>
            <h3>No Pending Artisan Verifications</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              All artisan partnership applications have been reviewed. When new craftspeople register, their profiles will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {pendingArtisans.map((art) => (
              <div key={art._id} className="card" style={{ padding: '2rem', background: '#FFFFFF' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '1.75rem', alignItems: 'start' }}>
                  <img
                    src={art.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80'}
                    alt={art.businessName}
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-terracotta-light)' }}
                  />

                  <div>
                    <span className="heritage-pill" style={{ marginBottom: '0.4rem' }}>
                      {art.craftSpecialization}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-maroon)', margin: '0.2rem 0' }}>
                      {art.businessName}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                      <b>Craftsman:</b> {art.user?.name} • <b>Location:</b> {art.townVillage}, {art.district}, {art.state} • <b>Phone:</b> {art.user?.phone || art.phone || 'N/A'}
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                      <b>Biography:</b> {art.bio}
                    </p>

                    {art.claimedTraditionHistory && (
                      <div style={{ backgroundColor: 'var(--color-surface-soft)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                        <b>Claimed Tradition Lineage:</b> {art.claimedTraditionHistory}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '160px' }}>
                    <button
                      type="button"
                      onClick={() => handleVerify(art._id, art.businessName)}
                      disabled={actionLoadingId === art._id}
                      className="btn btn-sm btn-primary"
                    >
                      <Check size={14} /> Verify Artisan
                    </button>

                    <button
                      type="button"
                      onClick={() => setRejectModalArtisan(art)}
                      disabled={actionLoadingId === art._id}
                      className="btn btn-sm btn-outline"
                      style={{ color: 'var(--color-danger)' }}
                    >
                      <X size={14} /> Reject Application
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalArtisan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.75rem' }}>Reject Artisan Verification</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Please provide feedback explaining why "<b>{rejectModalArtisan.businessName}</b>" could not be verified.
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Workshop location documentation insufficient; craft sample verification failed..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalArtisan(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === rejectModalArtisan._id}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--color-danger)' }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtisansPage;
