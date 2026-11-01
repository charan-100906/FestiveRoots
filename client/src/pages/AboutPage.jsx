import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page" style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container container-narrow">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={13} /> Our Cultural Journey
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>About FestiveRoots</h1>
          <p>
            Bridging the gap between India’s living craft legacies and conscious festive celebrations worldwide.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-maroon)', marginBottom: '1rem' }}>
            Our Mission & Philosophy
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            India is home to thousands of indigenous craft traditions that have thrived for centuries — from the softwood Kondapalli toys of Andhra Pradesh and the Persian-influenced cobalt Blue Pottery of Jaipur to the ancient 4,000-year-old lost-wax Dokra castings of Bengal. Yet, traditional artisans often face steep barriers: limited digital connectivity, exploitation by middlemen, and lack of visibility outside their immediate regional markets.
          </p>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            <b>FestiveRoots</b> serves as a transparent digital intermediary platform. We empower traditional artisans and small-scale cooperatives to directly list their authentic creations, set their own fair pricing, and coordinate safe doorstep delivery to consumers who cherish authentic Indian cultural craftsmanship.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '1.5rem 0', borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-terracotta)', fontWeight: 800 }}>100%</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Artisan Direct</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-maroon)', fontWeight: 800 }}>Verified</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>GI & Cluster Audits</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--color-saffron)', fontWeight: 800 }}>Eco-Safe</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Natural Materials</div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.35rem', color: 'var(--color-maroon)', margin: '2rem 0 0.75rem' }}>
            Academic Context & Implementation
          </h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            This platform is developed as a comprehensive Full Stack MERN development capstone demonstrating modern web engineering with React, Vite, Node.js, Express, and MongoDB. In this academic release, courier tracking and payment authorizations are modeled as safe, realistic simulations to illustrate end-to-end full stack architecture.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/products" className="btn btn-primary btn-lg">
            Discover Handcrafted Catalogue <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
