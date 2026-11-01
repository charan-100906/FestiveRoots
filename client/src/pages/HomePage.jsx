import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Heart,
  ChevronRight,
  Award,
  Package,
  Truck
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const [festivals, setFestivals] = useState([]);
  const [regions, setRegions] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [festivalsRes, regionsRes, productsRes, artisansRes] = await Promise.all([
          api.get('/festivals'),
          api.get('/regions'),
          api.get('/products?limit=8'),
          api.get('/artisans')
        ]);

        if (festivalsRes.data.success) setFestivals(festivalsRes.data.data.slice(0, 6));
        if (regionsRes.data.success) setRegions(regionsRes.data.data.slice(0, 6));
        if (productsRes.data.success) setFeaturedProducts(productsRes.data.data);
        if (artisansRes.data.success) setArtisans(artisansRes.data.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="heritage-pill" style={{ marginBottom: '1.25rem' }}>
              <Sparkles size={14} /> Preserving Indian Handcraft Traditions
            </div>
            <h1 className="hero-heading">
              Discover the Traditions Behind Every Product.
            </h1>
            <p className="hero-description">
              Explore handcrafted festive treasures from local artisans across India. Discover the stories, cultures, and generational craftsmanship behind every creation.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/artisans" className="btn btn-secondary btn-lg">
                Meet Our Artisans
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-label">Handcrafted Origin</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">28+</span>
                <span className="stat-label">Craft Clusters</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">Direct</span>
                <span className="stat-label">Artisan Benefit</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=1000&q=80"
                alt="Traditional Indian Artisan Crafting Terracotta"
                className="hero-main-img"
              />
              <div className="hero-floating-card">
                <div className="floating-card-icon">🪔</div>
                <div>
                  <div className="floating-card-title">Authentic GI Crafts</div>
                  <div className="floating-card-sub">From Kondapalli to Jaipur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY FESTIVAL (Dynamically Loaded from Database) */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <Calendar size={13} /> Sacred Celebrations
            </div>
            <h2>Shop by Festival</h2>
            <p>
              Handcrafted decor, ritual essentials, and gifts curated for India's vibrant regional festivals.
            </p>
          </div>

          <div className="grid grid-3">
            {festivals.map((fest) => (
              <Link
                key={fest._id}
                to={`/products?festival=${fest.slug}`}
                className="festival-card card"
              >
                <div className="festival-img-wrapper">
                  <img src={fest.image || 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=800&q=80'} alt={fest.name} />
                  <div className="festival-overlay">
                    <span className="festival-month">{fest.approximateMonth || 'Festive Season'}</span>
                    <h3 className="festival-title">{fest.name}</h3>
                  </div>
                </div>
                <div className="festival-card-content">
                  <p>{fest.description || 'Traditional crafts and pooja essentials.'}</p>
                  <span className="view-link">Explore Collection <ChevronRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/festivals" className="btn btn-outline-terracotta">
              View All Festivals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE BY REGION (Dynamically Loaded from Database) */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <MapPin size={13} /> Cultural Geography
            </div>
            <h2>Explore by Region</h2>
            <p>
              Travel through India's renowned craft hubs and discover timeless artistic legacies rooted in their soil.
            </p>
          </div>

          <div className="grid grid-3">
            {regions.map((reg) => (
              <Link
                key={reg._id}
                to={`/products?state=${encodeURIComponent(reg.state)}&district=${encodeURIComponent(reg.district)}`}
                className="region-card card"
              >
                <div className="region-img-wrapper">
                  <img src={reg.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'} alt={`${reg.district}, ${reg.state}`} />
                  <div className="region-badge-pill">
                    <MapPin size={12} /> {reg.state}
                  </div>
                </div>
                <div className="region-card-body">
                  <h3 className="region-name">{reg.district}{reg.townVillage ? ` (${reg.townVillage})` : ''}</h3>
                  <div className="craft-heritage-line">{reg.craftHeritage}</div>
                  <p className="region-desc">{reg.description}</p>
                  <span className="view-link">Browse Regional Crafts <ChevronRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/regions" className="btn btn-outline-terracotta">
              Discover All Craft Regions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (Dynamically Loaded from Database) */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={13} /> Masterpiece Collection
            </div>
            <h2>Featured Handcrafted Treasures</h2>
            <p>
              Direct from artisan workshops across India. Each piece tells a living cultural story.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
            </div>
          ) : (
            <div className="grid grid-4">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              View Complete Catalogue <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MEET OUR ARTISANS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <Award size={13} /> The Hands Behind The Craft
            </div>
            <h2>Meet Our Certified Artisans</h2>
            <p>
              Preserving ancient lineages of wood turning, lost-wax metal casting, and glazed ceramic artistry.
            </p>
          </div>

          <div className="grid grid-4">
            {artisans.map((art) => (
              <div key={art._id} className="artisan-profile-card card">
                <div className="artisan-avatar-frame">
                  <img
                    src={art.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80'}
                    alt={art.businessName}
                    className="artisan-img"
                  />
                  {art.verificationStatus === 'VERIFIED' && (
                    <div className="verified-badge-chip">
                      <ShieldCheck size={14} /> Certified
                    </div>
                  )}
                </div>
                <div className="artisan-card-details">
                  <h3 className="artisan-business">{art.businessName}</h3>
                  <div className="artisan-craft-title">{art.craftSpecialization}</div>
                  <div className="artisan-location">
                    <MapPin size={12} /> {art.townVillage}, {art.state}
                  </div>
                  <p className="artisan-bio-snip">{art.bio}</p>
                  <Link to={`/artisans/${art._id}`} className="btn btn-sm btn-outline" style={{ width: '100%', marginTop: 'auto' }}>
                    View Workshop Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/artisans" className="btn btn-outline-terracotta">
              Browse All Artisan Profiles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (The Intermediary Model) */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <Package size={13} /> Seamless Intermediary Fulfilment
            </div>
            <h2>How FestiveRoots Works</h2>
            <p>
              We connect conscious consumers with remote heritage clusters through coordinated logistics.
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card card">
              <div className="step-num">01</div>
              <div className="step-icon">🏺</div>
              <h4>Discover Authentic Craft</h4>
              <p>Explore verified products filtered by festival, region, craft technique, and certified artisan.</p>
            </div>

            <div className="step-arrow"><ArrowRight size={24} /></div>

            <div className="step-card card">
              <div className="step-num">02</div>
              <div className="step-icon">🛒</div>
              <h4>Place Your Order</h4>
              <p>Your order is validated and partitioned into artisan-specific fulfilment sub-orders.</p>
            </div>

            <div className="step-arrow"><ArrowRight size={24} /></div>

            <div className="step-card card">
              <div className="step-num">03</div>
              <div className="step-icon">🎨</div>
              <h4>Artisan Handcrafts</h4>
              <p>Local artisans confirm availability and handcraft or prepare items with care.</p>
            </div>

            <div className="step-arrow"><ArrowRight size={24} /></div>

            <div className="step-card card">
              <div className="step-num">04</div>
              <div className="step-icon">🚚</div>
              <h4>Coordinated Delivery</h4>
              <p>Platform coordinates regional collection and doorstep delivery with live tracking updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY FESTIVEROOTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
              <Heart size={13} /> Heritage First
            </div>
            <h2>Why Choose FestiveRoots?</h2>
            <p>Every purchase honors centuries of tradition and supports rural artisan livelihoods.</p>
          </div>

          <div className="grid grid-3">
            <div className="value-pillar card">
              <div className="pillar-icon">🏛️</div>
              <h3>Living Cultural Heritage</h3>
              <p>Discover the folklore, GI registration stories, and generational techniques behind each handcrafted artifact.</p>
            </div>
            <div className="value-pillar card">
              <div className="pillar-icon">🤝</div>
              <h3>Fair Direct Remuneration</h3>
              <p>Eliminate exploitative middlemen so traditional artisans receive transparent, dignified compensation.</p>
            </div>
            <div className="value-pillar card">
              <div className="pillar-icon">🌱</div>
              <h3>Organic & Eco-Friendly</h3>
              <p>Crafted using riverbed clays, non-toxic vegetable dyes, native softwoods, and sustainable raw materials.</p>
            </div>
            <div className="value-pillar card">
              <div className="pillar-icon">🔍</div>
              <h3>Transparent Origin Tracking</h3>
              <p>Clear distinction between artisan-declared traditions and independently audited regional GI credentials.</p>
            </div>
            <div className="value-pillar card">
              <div className="pillar-icon">📦</div>
              <h3>Safe Heritage Packaging</h3>
              <p>Multi-layered protective packaging designed specifically for delicate terracotta, woodwork, and ceramics.</p>
            </div>
            <div className="value-pillar card">
              <div className="pillar-icon">🪔</div>
              <h3>Festival-Ready Collections</h3>
              <p>Curated seasonal bundles for Diwali, Sankranti, Ganesh Chaturthi, Durga Puja, and traditional celebrations.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #FFFDF9 0%, #F7F1E5 100%);
          padding: 4.5rem 0 5rem 0;
          border-bottom: 1px solid var(--color-border);
          overflow: hidden;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 3.5rem;
        }
        .hero-heading {
          font-size: 3.25rem;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: var(--color-maroon);
        }
        .hero-description {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 580px;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.75rem;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
        }
        .stat-box {
          display: flex;
          flex-direction: column;
        }
        .stat-number {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--color-terracotta);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .hero-image-wrapper {
          position: relative;
        }
        .hero-image-frame {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: visible;
          box-shadow: var(--shadow-lg);
        }
        .hero-main-img {
          width: 100%;
          height: 480px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          border: 4px solid #FFFFFF;
        }
        .hero-floating-card {
          position: absolute;
          bottom: -1.25rem;
          left: -1.25rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .floating-card-icon {
          font-size: 1.75rem;
        }
        .floating-card-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-maroon);
        }
        .floating-card-sub {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        /* Festival Cards */
        .festival-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .festival-img-wrapper {
          position: relative;
          height: 190px;
          overflow: hidden;
        }
        .festival-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .festival-card:hover .festival-img-wrapper img {
          transform: scale(1.06);
        }
        .festival-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(28, 25, 23, 0.85) 0%, transparent 60%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1rem;
        }
        .festival-month {
          font-size: 0.72rem;
          color: var(--color-saffron-light);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .festival-title {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: #FFFDF9;
        }
        .festival-card-content {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          flex: 1;
        }
        .festival-card-content p {
          font-size: 0.86rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .view-link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-terracotta);
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* Region Cards */
        .region-card {
          overflow: hidden;
        }
        .region-img-wrapper {
          position: relative;
          height: 170px;
        }
        .region-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .region-badge-pill {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(28, 25, 23, 0.85);
          color: #FFFDF9;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .region-card-body {
          padding: 1.25rem;
        }
        .region-name {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .craft-heritage-line {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-terracotta);
          margin-bottom: 0.5rem;
        }
        .region-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        /* Artisan Profile Card */
        .artisan-profile-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          text-align: center;
          align-items: center;
        }
        .artisan-avatar-frame {
          position: relative;
          width: 110px;
          height: 110px;
          margin-bottom: 1rem;
        }
        .artisan-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--color-terracotta-light);
        }
        .verified-badge-chip {
          position: absolute;
          bottom: 0;
          right: -0.25rem;
          background-color: var(--color-success);
          color: #FFF;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.2rem;
          border: 2px solid #FFF;
        }
        .artisan-card-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          width: 100%;
        }
        .artisan-business {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }
        .artisan-craft-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-terracotta);
          margin-bottom: 0.25rem;
        }
        .artisan-location {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.65rem;
        }
        .artisan-bio-snip {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.45;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* How It Works Steps */
        .steps-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .step-card {
          flex: 1;
          padding: 1.75rem 1.25rem;
          text-align: center;
          position: relative;
        }
        .step-num {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-terracotta);
          background: var(--color-terracotta-light);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-icon {
          font-size: 2.25rem;
          margin-bottom: 0.85rem;
        }
        .step-card h4 {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-maroon);
          margin-bottom: 0.45rem;
        }
        .step-card p {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .step-arrow {
          color: var(--color-terracotta);
          opacity: 0.6;
        }

        /* Value Pillars */
        .value-pillar {
          padding: 1.75rem;
        }
        .pillar-icon {
          font-size: 2rem;
          margin-bottom: 0.85rem;
        }
        .value-pillar h3 {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-maroon);
          margin-bottom: 0.5rem;
        }
        .value-pillar p {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-description {
            margin: 0 auto 2rem auto;
          }
          .hero-actions {
            justify-content: center;
          }
          .hero-stats {
            justify-content: center;
          }
          .hero-floating-card {
            left: 50%;
            transform: translateX(-50%);
          }
          .steps-container {
            flex-direction: column;
          }
          .step-arrow {
            transform: rotate(90deg);
          }
        }
        @media (max-width: 600px) {
          .hero-heading {
            font-size: 2.35rem;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions a {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
