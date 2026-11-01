import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw, Sparkles, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      {/* Heritage Promise Banner */}
      <div className="footer-features-banner">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon"><MapPin size={24} /></div>
              <div>
                <h4>Regional Authenticity</h4>
                <p>Curated from authentic GI clusters and master artisan families.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><ShieldCheck size={24} /></div>
              <div>
                <h4>Direct Artisan Benefit</h4>
                <p>Intermediary platform ensuring fair returns to grassroots craftspeople.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Truck size={24} /></div>
              <div>
                <h4>Coordinated Fulfilment</h4>
                <p>Carefully packed at village workshops and coordinated for safe transit.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><RefreshCw size={24} /></div>
              <div>
                <h4>Safe Academic Demo</h4>
                <p>Demonstration marketplace testing simulated online & COD workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main">
        <div className="footer-columns">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">🪔</span>
              <span className="logo-title">FestiveRoots</span>
            </Link>
            <p className="brand-desc">
              Discover the traditions behind every product. An academic full-stack platform empowering traditional Indian artisans, handloom weavers, and folk craftspeople to share their cultural heritage globally.
            </p>
            <div className="academic-badge">
              <span>🎓 College Full Stack Development Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h5 className="footer-col-title">Marketplace</h5>
            <ul className="footer-links">
              <li><Link to="/products">Explore All Products</Link></li>
              <li><Link to="/festivals">Shop by Festival</Link></li>
              <li><Link to="/regions">Explore by Region</Link></li>
              <li><Link to="/artisans">Meet Our Artisans</Link></li>
              <li><Link to="/artisan/register">Become an Artisan Partner</Link></li>
            </ul>
          </div>

          {/* Regional Clusters */}
          <div className="footer-col">
            <h5 className="footer-col-title">Heritage Clusters</h5>
            <ul className="footer-links">
              <li><Link to="/regions">Kondapalli, Andhra Pradesh</Link></li>
              <li><Link to="/regions">Jaipur Blue Pottery, Rajasthan</Link></li>
              <li><Link to="/regions">Bishnupur Terracotta, Bengal</Link></li>
              <li><Link to="/regions">Channapatna Woodcraft, Karnataka</Link></li>
              <li><Link to="/regions">Varanasi Banarasi Zari, UP</Link></li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="footer-col">
            <h5 className="footer-col-title">Policies & Support</h5>
            <ul className="footer-links">
              <li><Link to="/about">About FestiveRoots</Link></li>
              <li><Link to="/contact">Contact & Workshop Inquiries</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping-policy">Shipping & Fulfilment Policy</Link></li>
              <li><Link to="/return-policy">Return & Refund Policy</Link></li>
              <li><Link to="/privacy-policy">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <div className="simulation-notice">
          <strong>Notice:</strong> FestiveRoots is developed as a complete full-stack academic demonstration application. Payment gateways and courier dispatch events are simulated for educational demonstration.
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FestiveRoots Marketplace. Handcrafted with pride for Indian regional artisans.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy</Link>
            <span>•</span>
            <Link to="/terms">Terms</Link>
            <span>•</span>
            <Link to="/login">Account Portal</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #241A17;
          color: #E7E0D3;
          margin-top: auto;
        }
        .footer-features-banner {
          background-color: #2F211D;
          border-bottom: 1px solid rgba(231, 224, 211, 0.1);
          padding: 2.5rem 0;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .feature-icon {
          color: var(--color-saffron);
          flex-shrink: 0;
          background: rgba(217, 119, 6, 0.12);
          padding: 0.6rem;
          border-radius: var(--radius-md);
        }
        .feature-item h4 {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          color: #FFFDF9;
          margin-bottom: 0.25rem;
        }
        .feature-item p {
          font-size: 0.8rem;
          color: #B5ACA3;
          line-height: 1.4;
        }

        .footer-main {
          padding: 3.5rem 1.5rem 2rem 1.5rem;
        }
        .footer-columns {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .logo-icon { font-size: 1.6rem; }
        .logo-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 600;
          color: #FFFDF9;
        }
        .brand-desc {
          font-size: 0.86rem;
          color: #B5ACA3;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .academic-badge {
          display: inline-block;
          background: rgba(194, 65, 12, 0.2);
          border: 1px solid rgba(194, 65, 12, 0.4);
          color: #FDBA74;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .footer-col-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #FFFDF9;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .footer-links a {
          color: #B5ACA3;
          font-size: 0.86rem;
        }
        .footer-links a:hover {
          color: var(--color-saffron);
          padding-left: 4px;
        }

        .simulation-notice {
          background-color: rgba(217, 119, 6, 0.08);
          border: 1px dashed rgba(217, 119, 6, 0.3);
          border-radius: var(--radius-md);
          padding: 0.85rem 1.25rem;
          font-size: 0.82rem;
          color: #FDE68A;
          margin-bottom: 2rem;
          text-align: center;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(231, 224, 211, 0.1);
          font-size: 0.82rem;
          color: #8C827A;
        }
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-bottom-links a:hover {
          color: #FFFDF9;
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .footer-columns {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          .footer-columns {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
