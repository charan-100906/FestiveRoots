import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ArrowRight, Award } from 'lucide-react';
import api from '../services/api';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const res = await api.get('/artisans');
        if (res.data.success) {
          setArtisans(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load artisans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  return (
    <div className="artisans-page" style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
            <Award size={13} /> Master Craftsmen Directory
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Meet Our Traditional Artisans</h1>
          <p>
            Connect directly with generational craftspeople and grassroots guild clusters across India. Every artisan is verified for authentic regional provenance.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : (
          <div className="grid grid-3">
            {artisans.map((art) => (
              <div key={art._id} className="card artisan-dir-card">
                <div className="artisan-dir-top">
                  <div className="artisan-dir-avatar">
                    <img
                      src={art.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80'}
                      alt={art.businessName}
                    />
                    {art.verificationStatus === 'VERIFIED' && (
                      <div className="verified-icon-chip" title="Verified Regional Craftsman">
                        <ShieldCheck size={16} />
                      </div>
                    )}
                  </div>

                  <div className="artisan-dir-meta">
                    <span className="artisan-dir-craft">{art.craftSpecialization}</span>
                    <h3 className="artisan-dir-name">{art.businessName}</h3>
                    <div className="artisan-dir-loc">
                      <MapPin size={13} /> {art.townVillage}, {art.district}, {art.state}
                    </div>
                  </div>
                </div>

                <div className="artisan-dir-body">
                  <p className="artisan-dir-bio">{art.bio}</p>
                  <Link
                    to={`/artisans/${art._id}`}
                    className="btn btn-outline-terracotta"
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    View Workshop Profile & Crafts <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .artisan-dir-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .artisan-dir-top {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .artisan-dir-avatar {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }
        .artisan-dir-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--color-terracotta-light);
        }
        .verified-icon-chip {
          position: absolute;
          bottom: 0;
          right: 0;
          background: var(--color-success);
          color: #FFF;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFF;
        }

        .artisan-dir-meta {
          flex: 1;
        }
        .artisan-dir-craft {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-terracotta);
          text-transform: uppercase;
          display: block;
        }
        .artisan-dir-name {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--color-maroon);
          margin: 0.2rem 0;
        }
        .artisan-dir-loc {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .artisan-dir-body {
          padding: 1.25rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .artisan-dir-bio {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.55;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ArtisansPage;
