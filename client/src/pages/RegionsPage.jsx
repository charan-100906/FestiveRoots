import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

const RegionsPage = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const res = await api.get('/regions');
        if (res.data.success) {
          setRegions(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load regions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return (
    <div className="regions-page" style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
            <MapPin size={13} /> Geographical Craft Clusters
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Explore by Craft Region</h1>
          <p>
            Journey across India's traditional craft geography. Each region preserves unique local materials, generational guild techniques, and cultural folklore.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : (
          <div className="grid grid-3">
            {regions.map((reg) => (
              <div key={reg._id} className="card region-hub-card">
                <div className="region-hub-img-wrap">
                  <img
                    src={reg.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'}
                    alt={`${reg.district}, ${reg.state}`}
                  />
                  <div className="region-state-pill">
                    <MapPin size={12} /> {reg.state}
                  </div>
                </div>

                <div className="region-hub-body">
                  <h3 className="region-hub-title">
                    {reg.district} {reg.townVillage ? `(${reg.townVillage})` : ''}
                  </h3>
                  <div className="region-hub-craft">{reg.craftHeritage}</div>
                  <p className="region-hub-desc">{reg.description}</p>
                  <Link
                    to={`/products?state=${encodeURIComponent(reg.state)}&district=${encodeURIComponent(reg.district)}`}
                    className="btn btn-outline-terracotta btn-sm"
                    style={{ marginTop: 'auto' }}
                  >
                    View Products from {reg.district} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .region-hub-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .region-hub-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .region-hub-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .region-hub-card:hover .region-hub-img-wrap img {
          transform: scale(1.05);
        }
        .region-state-pill {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(28, 25, 23, 0.85);
          backdrop-filter: blur(4px);
          color: #FFFDF9;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .region-hub-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .region-hub-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          margin-bottom: 0.25rem;
          color: var(--color-maroon);
        }
        .region-hub-craft {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-terracotta);
          margin-bottom: 0.75rem;
        }
        .region-hub-desc {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default RegionsPage;
