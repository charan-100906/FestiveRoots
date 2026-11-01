import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ArrowLeft, Sparkles, Phone, Mail } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const ArtisanDetailPage = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisanDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/artisans/${id}`);
        if (res.data.success) {
          setArtisan(res.data.data.artisan);
          setProducts(res.data.data.products);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Artisan profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <h2>Artisan Profile Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem' }}>{error}</p>
        <Link to="/artisans" className="btn btn-primary">Browse All Artisans</Link>
      </div>
    );
  }

  return (
    <div className="artisan-detail-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <Link to="/artisans" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to All Artisans
        </Link>

        {/* Hero Card */}
        <div className="card artisan-hero-card" style={{ padding: '2.5rem', background: '#FFFFFF', marginBottom: '3rem' }}>
          <div className="artisan-hero-flex">
            <div className="artisan-hero-avatar">
              <img
                src={artisan.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80'}
                alt={artisan.businessName}
              />
            </div>

            <div className="artisan-hero-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <span className="craft-pill">{artisan.craftSpecialization}</span>
                {artisan.verificationStatus === 'VERIFIED' && (
                  <span className="verified-pill">
                    <ShieldCheck size={14} /> Certified Regional Artisan
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '2.25rem', color: 'var(--color-maroon)', marginBottom: '0.5rem' }}>
                {artisan.businessName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <MapPin size={16} color="var(--color-terracotta)" />
                <span>{artisan.townVillage}, {artisan.district} District, {artisan.state}, India</span>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {artisan.bio}
              </p>

              {artisan.claimedTraditionHistory && (
                <div className="tradition-callout">
                  <span className="tradition-label">Generational Tradition & Lineage</span>
                  <p>{artisan.claimedTraditionHistory}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Handcrafted Products by This Artisan */}
        <div>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.85rem' }}>Masterpieces by {artisan.businessName}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Showing {products.length} {products.length === 1 ? 'handcrafted piece' : 'handcrafted pieces'} currently available in our catalogue.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#FFFFFF' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>This artisan has no active approved products listed currently.</p>
            </div>
          ) : (
            <div className="grid grid-4">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={{ ...prod, artisan }} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .artisan-hero-flex {
          display: flex;
          gap: 2.5rem;
          align-items: flex-start;
        }
        .artisan-hero-avatar {
          width: 140px;
          height: 140px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--color-terracotta-light);
        }
        .artisan-hero-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .artisan-hero-content {
          flex: 1;
        }
        .craft-pill {
          background-color: var(--color-terracotta-light);
          color: var(--color-terracotta-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .verified-pill {
          background-color: var(--color-success-bg);
          color: var(--color-success);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .tradition-callout {
          background-color: var(--color-surface-soft);
          border-left: 3px solid var(--color-terracotta);
          padding: 0.85rem 1.25rem;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .tradition-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-terracotta);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .tradition-callout p {
          font-size: 0.86rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .artisan-hero-flex {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .tradition-callout {
            border-left: none;
            border-top: 3px solid var(--color-terracotta);
          }
        }
      `}</style>
    </div>
  );
};

export default ArtisanDetailPage;
