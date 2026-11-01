import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  Package,
  Clock,
  TrendingUp,
  ShieldCheck,
  Layers,
  Calendar,
  MapPin,
  Truck,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="heritage-pill" style={{ marginBottom: '0.4rem' }}>
            🛡️ Platform Administration
          </div>
          <h1 style={{ fontSize: '2.25rem', color: 'var(--color-maroon)' }}>
            FestiveRoots Central Command Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Oversee artisan verifications, product catalog quality reviews, dynamic taxonomy management, and regional fulfilment.
          </p>
        </div>

        {/* 7 Key Platform Metrics */}
        <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Total Customers</span>
            <span className="metric-val">{stats?.totalCustomers ?? 0}</span>
            <span className="metric-sub">Registered buyers</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Total Artisans</span>
            <span className="metric-val">{stats?.totalArtisans ?? 0}</span>
            <span className="metric-sub">Grassroots craftspeople</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Product Approvals Pending</span>
            <span className="metric-val" style={{ color: stats?.pendingProductApprovals > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {stats?.pendingProductApprovals ?? 0}
            </span>
            <Link to="/admin/products" style={{ fontSize: '0.78rem', color: 'var(--color-terracotta)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
              Review Queue <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Artisans Awaiting Verification</span>
            <span className="metric-val" style={{ color: stats?.pendingArtisanVerifications > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {stats?.pendingArtisanVerifications ?? 0}
            </span>
            <Link to="/admin/artisans" style={{ fontSize: '0.78rem', color: 'var(--color-terracotta)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
              Verify Artisans <ArrowRight size={12} />
            </Link>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Total Catalog Products</span>
            <span className="metric-val">{stats?.totalProducts ?? 0}</span>
            <span className="metric-sub">Across all craft clusters</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Total Orders</span>
            <span className="metric-val">{stats?.totalOrders ?? 0}</span>
            <span className="metric-sub">Processed through platform</span>
          </div>

          <div className="card metric-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <span className="metric-lbl">Platform Gross Volume</span>
            <span className="metric-val" style={{ color: 'var(--color-maroon)' }}>
              ₹{stats?.totalRevenue?.toLocaleString('en-IN') ?? 0}
            </span>
            <span className="metric-sub">Non-cancelled order totals</span>
          </div>
        </div>

        {/* Quick Management Hub */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Administrative Management Portals</h3>
          <div className="grid grid-3">
            <Link to="/admin/products" className="card admin-portal-btn-card">
              <div className="portal-btn-icon"><Package size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '0.25rem' }}>
                  Product Approvals ({stats?.pendingProductApprovals ?? 0} Pending)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Audit new product submissions, review claimed regional origin, and approve catalogue listings.
                </p>
              </div>
            </Link>

            <Link to="/admin/artisans" className="card admin-portal-btn-card">
              <div className="portal-btn-icon"><Award size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '0.25rem' }}>
                  Artisan Verifications ({stats?.pendingArtisanVerifications ?? 0} Pending)
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Verify credentials, village craft cluster locations, and tradition lineages.
                </p>
              </div>
            </Link>

            <Link to="/admin/categories" className="card admin-portal-btn-card">
              <div className="portal-btn-icon"><Layers size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '0.25rem' }}>
                  Dynamic Categories Manager
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Add, edit, or deactivate categories without altering application source code.
                </p>
              </div>
            </Link>

            <Link to="/admin/festivals" className="card admin-portal-btn-card">
              <div className="portal-btn-icon"><Calendar size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '0.25rem' }}>
                  Dynamic Festivals Manager
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Introduce new cultural celebrations and seasonal collections dynamically into MongoDB.
                </p>
              </div>
            </Link>

            <Link to="/admin/regions" className="card admin-portal-btn-card">
              <div className="portal-btn-icon"><MapPin size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '0.25rem' }}>
                  Dynamic Region & Cluster Manager
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Register states, districts, and indigenous craft traditions for regional storytelling.
                </p>
              </div>
            </Link>

            <Link to="/admin/orders" className="card admin-portal-btn-card">
              <div className="portal-btn-icon"><Truck size={24} /></div>
              <div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--color-maroon)', marginBottom: '0.25rem' }}>
                  Global Order Monitoring
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Inspect all platform customer orders, multi-artisan split fulfilment, and simulated tracking.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Platform Orders */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recent Platform Orders</h3>
            <Link to="/admin/orders" className="btn btn-sm btn-outline-terracotta">
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border-light)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Order Ref</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Items</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Total</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Payment</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                      {ord.orderNumber}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{ord.customerName}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{ord.orderItems?.length} items</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{ord.paymentStatus} ({ord.paymentMethod})</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <StatusBadge status={ord.overallStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .admin-portal-btn-card {
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: #FFFFFF;
          transition: var(--transition);
        }
        .admin-portal-btn-card:hover {
          border-color: var(--color-terracotta);
          transform: translateY(-2px);
        }
        .portal-btn-icon {
          color: var(--color-terracotta);
          background: var(--color-terracotta-soft);
          padding: 0.65rem;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
