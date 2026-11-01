import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ShieldCheck, MapPin, Eye, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const AdminProductsPage = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModalProd, setRejectModalProd] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products/pending');
      if (res.data.success) {
        setPendingProducts(res.data.data);
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

  const handleApprove = async (prodId, isVerifiedOrigin = false) => {
    try {
      setActionLoadingId(prodId);
      setMessage(null);
      const res = await api.patch(`/admin/products/${prodId}/approval`, {
        status: 'APPROVED',
        originVerificationStatus: isVerifiedOrigin ? 'INDEPENDENTLY_VERIFIED' : 'DECLARED_BY_ARTISAN',
        originVerificationDetails: isVerifiedOrigin
          ? 'Approved by FestiveRoots Craft Council with verified cluster documentation.'
          : 'Self-declared regional handicraft tradition on file.'
      });

      if (res.data.success) {
        setPendingProducts(pendingProducts.filter((p) => p._id !== prodId));
        setMessage({ type: 'success', text: `Product "${res.data.data.name}" approved! It is now live in the public catalog without source code modification.` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Approval failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalProd || !rejectionReason.trim()) return;

    try {
      setActionLoadingId(rejectModalProd._id);
      const res = await api.patch(`/admin/products/${rejectModalProd._id}/approval`, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim()
      });

      if (res.data.success) {
        setPendingProducts(pendingProducts.filter((p) => p._id !== rejectModalProd._id));
        setMessage({ type: 'success', text: `Product "${rejectModalProd.name}" rejected.` });
        setRejectModalProd(null);
        setRejectionReason('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Rejection failed' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="admin-products-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem' }}>Product Listing Approvals Queue</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Review artisan submissions, verify claimed regional traditions, and approve items to make them instantly discoverable in the marketplace.
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
        ) : pendingProducts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3>Approvals Queue is Clear!</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0.75rem 0' }}>
              All submitted artisan products have been reviewed. When artisans submit new items, they will appear here.
            </p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              View Live Marketplace Catalogue
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {pendingProducts.map((prod) => (
              <div key={prod._id} className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                  <img
                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'}
                    alt={prod.name}
                    style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />

                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="heritage-pill">{prod.craftType}</span>
                      <span className="heritage-pill" style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-text-main)' }}>
                        {prod.category?.name || prod.categoryName}
                      </span>
                      {prod.festival?.name && (
                        <span className="heritage-pill" style={{ backgroundColor: 'var(--color-saffron-light)', color: 'var(--color-saffron-dark)' }}>
                          {prod.festival.name}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-maroon)', marginBottom: '0.35rem' }}>
                      {prod.name}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      Artisan Workshop: <b>{prod.artisan?.businessName || 'Artisan'}</b> ({prod.artisan?.state || prod.state})
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                      {prod.description}
                    </p>

                    <div style={{ backgroundColor: 'var(--color-surface-soft)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px', color: 'var(--color-terracotta)' }} />
                      <b>Claimed Origin:</b> {prod.claimedOrigin} • <b>Price:</b> ₹{prod.price?.toLocaleString('en-IN')} • <b>Stock:</b> {prod.isMadeToOrder ? 'Made-to-Order' : prod.stock}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', minWidth: '170px' }}>
                    <button
                      type="button"
                      onClick={() => handleApprove(prod._id, true)}
                      disabled={actionLoadingId === prod._id}
                      className="btn btn-sm btn-primary"
                      title="Approve as verified cluster origin"
                    >
                      <Check size={14} /> Approve & Verify
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApprove(prod._id, false)}
                      disabled={actionLoadingId === prod._id}
                      className="btn btn-sm btn-outline"
                      title="Approve as artisan self-declared"
                    >
                      Approve (Declared)
                    </button>

                    <button
                      type="button"
                      onClick={() => setRejectModalProd(prod)}
                      disabled={actionLoadingId === prod._id}
                      className="btn btn-sm btn-outline"
                      style={{ color: 'var(--color-danger)' }}
                    >
                      <X size={14} /> Reject with Reason
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalProd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ color: 'var(--color-danger)', marginBottom: '0.75rem' }}>Reject Product Listing</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Please provide feedback explaining why "<b>{rejectModalProd.name}</b>" does not meet platform criteria.
            </p>

            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  rows="3"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Photo quality too blurry; craft origin details unverified..."
                  className="form-textarea"
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalProd(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId === rejectModalProd._id}
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

export default AdminProductsPage;
