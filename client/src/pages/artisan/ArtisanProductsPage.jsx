import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

const ArtisanProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/artisan/my-products');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleToggleActive = async (productId, currentActive) => {
    try {
      const res = await api.put(`/products/${productId}`, {
        isActive: !currentActive
      });
      if (res.data.success) {
        setProducts(products.map((p) => (p._id === productId ? { ...p, isActive: !currentActive } : p)));
        setMessage({ type: 'success', text: `Product visibility set to ${!currentActive ? 'Active' : 'Inactive'}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update visibility' });
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await api.delete(`/products/${productId}`);
      if (res.data.success) {
        setProducts(products.filter((p) => p._id !== productId));
        setMessage({ type: 'success', text: 'Product removed successfully' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  return (
    <div className="artisan-products-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>My Handcrafted Products & Inventory</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Manage your listings, stock quantities, and track administrative review statuses.
            </p>
          </div>
          <Link to="/artisan/products/new" className="btn btn-primary">
            <PlusCircle size={16} /> Add New Craft Listing
          </Link>
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
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF' }}>
            <h3>No Handcrafted Products Yet</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0.75rem 0 1.5rem' }}>
              Begin creating your workshop catalog. New products are submitted to administrators and will appear live once approved.
            </p>
            <Link to="/artisan/products/new" className="btn btn-primary">
              <PlusCircle size={16} /> Add New Product
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-light)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Product</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Stock / Availability</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Approval Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Visibility</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80'}
                            alt={prod.name}
                            style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{prod.craftType}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem' }}>{prod.categoryName}</td>

                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>
                        ₹{prod.price?.toLocaleString('en-IN')}
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        {prod.isMadeToOrder ? (
                          <span style={{ color: 'var(--color-saffron-dark)', fontWeight: 600, fontSize: '0.82rem' }}>
                            Made to Order ({prod.preparationTimeDays}d prep)
                          </span>
                        ) : (
                          <span>{prod.stock} units</span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <StatusBadge status={prod.approvalStatus} />
                        {prod.approvalStatus === 'REJECTED' && prod.rejectionReason && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-danger)', marginTop: '0.2rem' }}>
                            {prod.rejectionReason}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(prod._id, prod.isActive)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor: prod.isActive ? 'var(--color-success-bg)' : 'var(--color-surface-soft)',
                            color: prod.isActive ? 'var(--color-success)' : 'var(--color-text-muted)',
                            padding: '0.25rem 0.5rem'
                          }}
                        >
                          {prod.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                          {prod.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Link to={`/artisan/products/edit/${prod._id}`} className="btn btn-sm btn-outline">
                            <Edit3 size={14} /> Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod._id, prod.name)}
                            className="btn btn-sm btn-outline"
                            style={{ color: 'var(--color-danger)' }}
                            title="Delete Listing"
                          >
                            <Trash2 size={14} />
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
    </div>
  );
};

export default ArtisanProductsPage;
