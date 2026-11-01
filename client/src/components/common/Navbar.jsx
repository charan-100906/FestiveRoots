import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isArtisan, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar-wrapper">
      {/* Top Banner with Indian Heritage Note */}
      <div className="top-banner">
        <div className="container banner-content">
          <span>✨ Connecting Traditional Indian Artisans Directly with Connoisseurs of Culture</span>
          <div className="banner-links">
            <Link to="/about">Our Mission</Link>
            <span className="dot">•</span>
            <Link to="/contact">Artisan Support</Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="navbar-main">
        <div className="container nav-inner">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="logo-diya">🪔</div>
            <div className="brand-text">
              <span className="brand-title">FestiveRoots</span>
              <span className="brand-subtitle">Traditions Behind Every Product</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="desktop-search">
            <input
              type="text"
              placeholder="Search handcrafted toys, terracotta diyas, blue pottery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" title="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            <Link to="/products" className="nav-link">Explore</Link>
            <Link to="/festivals" className="nav-link">Festivals</Link>
            <Link to="/regions" className="nav-link">Regions</Link>
            <Link to="/artisans" className="nav-link">Artisans</Link>
          </nav>

          {/* Actions: Wishlist, Cart, User Profile */}
          <div className="nav-actions">
            {/* Wishlist Link */}
            <Link to="/wishlist" className="action-icon-btn" title="Saved Wishlist">
              <Heart size={21} />
              {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
            </Link>

            {/* Shopping Cart Link */}
            <Link to="/cart" className="action-icon-btn cart-btn" title="Shopping Cart">
              <ShoppingBag size={21} />
              {totalItemsCount > 0 && <span className="action-badge">{totalItemsCount}</span>}
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="user-profile-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="user-avatar-circle">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="user-firstname">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu" onClick={() => setDropdownOpen(false)}>
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <div className="dropdown-user-role">{user?.role?.toUpperCase()}</div>
                    </div>

                    <div className="dropdown-divider"></div>

                    {/* Customer Links */}
                    {user?.role === 'customer' && (
                      <>
                        <Link to="/customer/orders" className="dropdown-item">
                          📦 My Orders & Tracking
                        </Link>
                        <Link to="/wishlist" className="dropdown-item">
                          ❤️ My Wishlist
                        </Link>
                      </>
                    )}

                    {/* Artisan Links */}
                    {isArtisan && (
                      <>
                        <Link to="/artisan/dashboard" className="dropdown-item">
                          📊 Artisan Dashboard
                        </Link>
                        <Link to="/artisan/products" className="dropdown-item">
                          🏺 My Products & Inventory
                        </Link>
                        <Link to="/artisan/products/new" className="dropdown-item">
                          ➕ Add New Product
                        </Link>
                        <Link to="/artisan/orders" className="dropdown-item">
                          📬 Incoming Orders & Fulfilment
                        </Link>
                        <Link to="/artisan/profile" className="dropdown-item">
                          🛖 Workshop Profile
                        </Link>
                      </>
                    )}

                    {/* Admin Links */}
                    {isAdmin && (
                      <>
                        <Link to="/admin/dashboard" className="dropdown-item">
                          🛡️ Admin Dashboard
                        </Link>
                        <Link to="/admin/products" className="dropdown-item">
                          ✅ Product Approvals
                        </Link>
                        <Link to="/admin/artisans" className="dropdown-item">
                          🧑‍🎨 Artisan Verifications
                        </Link>
                        <Link to="/admin/categories" className="dropdown-item">
                          🏷️ Category Manager
                        </Link>
                        <Link to="/admin/festivals" className="dropdown-item">
                          🎉 Festival Manager
                        </Link>
                        <Link to="/admin/regions" className="dropdown-item">
                          🗺️ Region Manager
                        </Link>
                        <Link to="/admin/orders" className="dropdown-item">
                          📑 Order Monitoring
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>

                    <button
                      type="button"
                      onClick={logout}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="guest-actions">
                <Link to="/login" className="btn btn-sm btn-outline">
                  Sign In
                </Link>
                <Link to="/artisan/register" className="btn btn-sm btn-primary become-artisan-btn">
                  Join as Artisan
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Search products, regions, craft types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>

          <nav className="mobile-nav-links" onClick={() => setMobileMenuOpen(false)}>
            <Link to="/" className="mobile-nav-item">Home</Link>
            <Link to="/products" className="mobile-nav-item">Explore Products</Link>
            <Link to="/festivals" className="mobile-nav-item">Festivals</Link>
            <Link to="/regions" className="mobile-nav-item">Regions</Link>
            <Link to="/artisans" className="mobile-nav-item">Artisans</Link>
            <Link to="/wishlist" className="mobile-nav-item">Saved Wishlist ({wishlist.length})</Link>
            <Link to="/cart" className="mobile-nav-item">Cart ({totalItemsCount})</Link>

            <div className="mobile-divider"></div>

            {isAuthenticated ? (
              <>
                <div className="mobile-user-greeting">Signed in as <b>{user?.name}</b> ({user?.role})</div>
                {user?.role === 'customer' && (
                  <Link to="/customer/orders" className="mobile-nav-item">My Orders & Tracking</Link>
                )}
                {isArtisan && (
                  <>
                    <Link to="/artisan/dashboard" className="mobile-nav-item">Artisan Dashboard</Link>
                    <Link to="/artisan/products" className="mobile-nav-item">My Products</Link>
                    <Link to="/artisan/orders" className="mobile-nav-item">Artisan Orders</Link>
                  </>
                )}
                {isAdmin && (
                  <Link to="/admin/dashboard" className="mobile-nav-item">Admin Dashboard</Link>
                )}
                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="btn btn-sm btn-outline"
                  style={{ marginTop: '1rem', width: '100%' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="mobile-guest-buttons">
                <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Sign In</Link>
                <Link to="/artisan/register" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Join as Artisan</Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Component Styles */}
      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 99;
          background-color: var(--color-surface);
          box-shadow: var(--shadow-sm);
        }
        .top-banner {
          background-color: var(--color-maroon);
          color: #FFFDF9;
          font-size: 0.78rem;
          padding: 0.35rem 0;
          font-weight: 500;
        }
        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .banner-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .banner-links a:hover {
          color: var(--color-saffron-light);
        }
        .dot { opacity: 0.5; }

        .navbar-main {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .logo-diya {
          font-size: 1.85rem;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(194, 65, 12, 0.3));
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-maroon);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .brand-subtitle {
          font-size: 0.68rem;
          color: var(--color-terracotta);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .desktop-search {
          flex: 1;
          max-width: 420px;
          position: relative;
        }
        .search-input {
          width: 100%;
          padding: 0.55rem 2.5rem 0.55rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 0.86rem;
          background-color: var(--color-surface-soft);
          transition: var(--transition);
        }
        .search-input:focus {
          outline: none;
          background-color: #FFFFFF;
          border-color: var(--color-terracotta);
          box-shadow: 0 0 0 3px rgba(194, 65, 12, 0.12);
        }
        .search-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 0.25rem;
        }
        .search-btn:hover {
          color: var(--color-terracotta);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .nav-link {
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--color-text-main);
          padding: 0.25rem 0;
          position: relative;
        }
        .nav-link:hover {
          color: var(--color-terracotta);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .action-icon-btn {
          position: relative;
          color: var(--color-text-main);
          padding: 0.5rem;
          border-radius: var(--radius-full);
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-icon-btn:hover {
          background-color: var(--color-surface-soft);
          color: var(--color-terracotta);
        }
        .action-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: var(--color-terracotta);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }

        .user-dropdown-container {
          position: relative;
        }
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: 1px solid var(--color-border);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--color-text-main);
        }
        .user-avatar-circle {
          width: 24px;
          height: 24px;
          background-color: var(--color-terracotta);
          color: #FFF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 230px;
          padding: 0.5rem 0;
          z-index: 100;
        }
        .dropdown-header {
          padding: 0.5rem 1rem;
        }
        .dropdown-user-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--color-text-main);
        }
        .dropdown-user-role {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-terracotta);
        }
        .dropdown-divider {
          height: 1px;
          background-color: var(--color-border-light);
          margin: 0.4rem 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.86rem;
          color: var(--color-text-main);
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: var(--color-surface-soft);
          color: var(--color-terracotta);
        }
        .logout-item {
          color: var(--color-danger);
        }

        .guest-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .become-artisan-btn {
          white-space: nowrap;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--color-text-main);
          cursor: pointer;
          padding: 0.35rem;
        }

        .mobile-drawer {
          background-color: var(--color-surface);
          border-bottom: 2px solid var(--color-terracotta);
          padding: 1.25rem;
        }
        .mobile-search-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mobile-nav-item {
          font-size: 1rem;
          font-weight: 600;
          padding: 0.4rem 0;
          color: var(--color-text-main);
        }
        .mobile-divider {
          height: 1px;
          background-color: var(--color-border);
          margin: 0.5rem 0;
        }
        .mobile-user-greeting {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 900px) {
          .desktop-search, .desktop-nav, .become-artisan-btn {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
