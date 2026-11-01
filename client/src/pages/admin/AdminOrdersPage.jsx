import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Truck, Package, Clock, Filter } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.overallStatus === statusFilter);

  return (
    <div className="admin-orders-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Global Order & Fulfilment Monitoring</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Monitor customer purchases, multi-artisan sub-orders, and simulated logistics dispatches across India.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
            >
              <option value="ALL">All Statuses ({orders.length})</option>
              <option value="PLACED">Placed</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY_FOR_COLLECTION">Ready for Pickup</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF' }}>
            <h3>No Orders Found</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0.5rem 0' }}>No customer orders match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-light)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Order Ref</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Items Snapshot</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Payment</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Overall Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--color-maroon)' }}>
                        {ord.orderNumber}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div><b>{ord.customerName}</b></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ord.customerEmail}</div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontSize: '0.82rem' }}>
                          {ord.orderItems?.length} items ({ord.orderItems?.map((it) => it.artisanName).filter((v, i, a) => a.indexOf(v) === i).length} artisans)
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                          {ord.paymentStatus} ({ord.paymentMethod})
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <StatusBadge status={ord.overallStatus} />
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <Link to={`/customer/orders/${ord._id}`} className="btn btn-sm btn-outline">
                          <Eye size={14} /> Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
