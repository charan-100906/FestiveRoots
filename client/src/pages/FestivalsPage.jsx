import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

const FestivalsPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setLoading(true);
        const res = await api.get('/festivals');
        if (res.data.success) {
          setFestivals(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load festivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  return (
    <div className="festivals-page" style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
            <Calendar size={13} /> Sacred Calendar of India
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Shop by Festival</h1>
          <p>
            Explore handcrafted ritual artifacts, pooja essentials, and celebratory home decor curated dynamically from the FestiveRoots database for each auspicious occasion.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
          </div>
        ) : (
          <div className="grid grid-3">
            {festivals.map((fest) => (
              <div key={fest._id} className="card festival-explore-card">
                <div className="festival-explore-img-wrap">
                  <img
                    src={fest.image || 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=800&q=80'}
                    alt={fest.name}
                  />
                  <div className="fest-month-badge">{fest.approximateMonth || 'Festive Season'}</div>
                </div>

                <div className="fest-card-content">
                  <h3 className="fest-card-title">{fest.name}</h3>
                  <p className="fest-card-desc">{fest.description}</p>
                  <Link
                    to={`/products?festival=${fest.slug}`}
                    className="btn btn-outline-terracotta btn-sm"
                    style={{ marginTop: 'auto' }}
                  >
                    Explore Festive Collection <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .festival-explore-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .festival-explore-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .festival-explore-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .festival-explore-card:hover .festival-explore-img-wrap img {
          transform: scale(1.05);
        }
        .fest-month-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: rgba(28, 25, 23, 0.85);
          backdrop-filter: blur(4px);
          color: var(--color-saffron-light);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .fest-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .fest-card-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          margin-bottom: 0.5rem;
          color: var(--color-maroon);
        }
        .fest-card-desc {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default FestivalsPage;
