import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Truck,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Info
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';

const ArtisanDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [fulfilments, setFulfilments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanData = async () => {
      try {
        setLoading(true);
        const [profRes, prodsRes, fulsRes] = await Promise.all([
          api.get('/artisans/me/profile'),
          api.get('/products/artisan/my-products'),
          api.get('/fulfilments/artisan/my-orders')
        ]);

        if (profRes.data.success) setProfile(profRes.data.data);
        if (prodsRes.data.success) setProducts(prodsRes.data.data);
        if (fulsRes.data.success) setFulfilments(fulsRes.data.data);
      } catch (err) {
        console.error('Failed to load artisan dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  const approvedProductsCount = products.filter((p) => p.approvalStatus === 'APPROVED').length;
  const pendingProductsCount = products.filter((p) => p.approvalStatus === 'PENDING').length;
  const activeOrdersCount = fulfilments.filter((f) =>
    ['AWAITING_ARTISAN_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'READY_FOR_COLLECTION', 'SHIPPED'].includes(f.fulfilmentStatus)
  ).length;

  return (
    <div className="artisan-dashboard-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div className="dashboard-welcome-card card" style={{ padding: '2rem', background: '#FFFFFF', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="heritage-pill" style={{ marginBottom: '0.4rem' }}>
                Workshop Portal
              </div>
              <h1 style={{ fontSize: '1.85rem', color: 'var(--color-maroon)' }}>
                Namaste, {profile?.businessName || user?.name}!
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {profile?.craftSpecialization} • {profile?.townVillage}, {profile?.district}, {profile?.state}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/artisan/products/new" className="btn btn-primary">
                <PlusCircle size={16} /> Add New Craft Product
              </Link>
              <Link to="/artisan/orders" className="btn btn-outline">
                <Truck size={16} /> Incoming Orders ({activeOrdersCount})
              </Link>
            </div>
          </div>
        </div>

        {/* Verification Alert Banner */}
        {profile?.verificationStatus === 'PENDING' && (
          <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
            <Info size={20} style={{ flexShrink: 0 }} />
            <div>
              <b>Artisan Profile Verification Pending:</b> Your workshop application is under administrative review. You can create and draft your handcrafted product listings right now; they will become publicly visible once approved.
            </div>
          </div>
        )}

        {profile?.verificationStatus === 'REJECTED' && (
          <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <b>Verification Not Approved:</b> {profile.rejectionReason || 'Please update your regional craft credentials in your workshop profile.'}
            </div>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Total Catalog Products</span>
            <span className="metric-val">{products.length}</span>
            <span className="metric-sub">{approvedProductsCount} live on marketplace</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Pending Approvals</span>
            <span className="metric-val" style={{ color: 'var(--color-saffron)' }}>{pendingProductsCount}</span>
            <span className="metric-sub">Awaiting admin review</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Active Assigned Orders</span>
            <span className="metric-val" style={{ color: 'var(--color-terracotta)' }}>{activeOrdersCount}</span>
            <span className="metric-sub">In preparation / transit</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Verification Status</span>
            <div style={{ marginTop: '0.4rem' }}>
              <StatusBadge status={profile?.verificationStatus || 'PENDING'} />
            </div>
            <span className="metric-sub" style={{ marginTop: '0.4rem', display: 'block' }}>Platform cluster status</span>
          </div>
        </div>

        {/* Incoming Orders Preview */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Incoming Order Assignments</h3>
            <Link to="/artisan/orders" className="btn btn-sm btn-outline-terracotta">
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          {fulfilments.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No order items have been assigned to your workshop yet. Once customers order your products, they will appear here!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {fulfilments.slice(0, 4).map((ful) => (
                <div key={ful._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--color-surface-soft)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Order #{ful.orderNumber}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {ful.items?.length} {ful.items?.length === 1 ? 'item' : 'items'} • Subtotal: ₹{ful.subtotal?.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StatusBadge status={ful.fulfilmentStatus} />
                    <Link to="/artisan/orders" className="btn btn-sm btn-outline">
                      Manage Fulfilment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Products Table Preview */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>My Handcrafted Product Catalogue</h3>
            <Link to="/artisan/products" className="btn btn-sm btn-outline-terracotta">
              Manage Inventory <ArrowRight size={14} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>You haven't added any products to your workshop catalogue yet.</p>
              <Link to="/artisan/products/new" className="btn btn-primary">
                <PlusCircle size={16} /> Add Your First Product
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-light)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Product</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Craft Type</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Stock</th>
                    <th style={{ padding: '0.65rem 0.5rem' }}>Approval</th>
                    <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((prod) => (
                    <tr key={prod._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={prod.images?.[0]} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 600 }}>{prod.name}</span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{prod.craftType}</td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>₹{prod.price?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {prod.isMadeToOrder ? <span style={{ color: 'var(--color-saffron-dark)', fontWeight: 600 }}>Made to Order</span> : prod.stock}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <StatusBadge status={prod.approvalStatus} />
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <Link to={`/artisan/products/edit/${prod._id}`} className="btn btn-sm btn-outline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .metric-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }
        .metric-val {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-maroon);
          line-height: 1.1;
        }
        .metric-sub {
          font-size: 0.78rem;
          color: var(--color-text-light);
          margin-top: 0.2rem;
        }
      `}</style>
    </div>
  );
};

export default ArtisanDashboardPage;
