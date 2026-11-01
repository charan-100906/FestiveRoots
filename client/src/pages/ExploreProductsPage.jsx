import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const ExploreProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [festival, setFestival] = useState(searchParams.get('festival') || 'all');
  const [state, setState] = useState(searchParams.get('state') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Taxonomy options from database
  const [categoriesList, setCategoriesList] = useState([]);
  const [festivalsList, setFestivalsList] = useState([]);
  const [regionsList, setRegionsList] = useState([]);

  // Results state
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load taxonomies once
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const [catsRes, festsRes, regsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/festivals'),
          api.get('/regions')
        ]);
        if (catsRes.data.success) setCategoriesList(catsRes.data.data);
        if (festsRes.data.success) setFestivalsList(festsRes.data.data);
        if (regsRes.data.success) setRegionsList(regsRes.data.data);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    fetchTaxonomies();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const querySearch = searchParams.get('search') || '';
    const queryCat = searchParams.get('category') || 'all';
    const queryFest = searchParams.get('festival') || 'all';
    const queryState = searchParams.get('state') || 'all';
    const queryMin = searchParams.get('minPrice') || '';
    const queryMax = searchParams.get('maxPrice') || '';
    const querySort = searchParams.get('sort') || 'newest';
    const queryPage = Number(searchParams.get('page')) || 1;

    setSearch(querySearch);
    setCategory(queryCat);
    setFestival(queryFest);
    setState(queryState);
    setMinPrice(queryMin);
    setMaxPrice(queryMax);
    setSort(querySort);
    setPage(queryPage);

    fetchFilteredProducts({
      search: querySearch,
      category: queryCat !== 'all' ? queryCat : '',
      festival: queryFest !== 'all' ? queryFest : '',
      state: queryState !== 'all' ? queryState : '',
      minPrice: queryMin,
      maxPrice: queryMax,
      sort: querySort,
      page: queryPage
    });
  }, [searchParams]);

  const fetchFilteredProducts = async (params) => {
    try {
      setLoading(true);
      const queryObj = {};
      if (params.search) queryObj.search = params.search;
      if (params.category) queryObj.category = params.category;
      if (params.festival) queryObj.festival = params.festival;
      if (params.state) queryObj.state = params.state;
      if (params.minPrice) queryObj.minPrice = params.minPrice;
      if (params.maxPrice) queryObj.maxPrice = params.maxPrice;
      if (params.sort) queryObj.sort = params.sort;
      queryObj.page = params.page || 1;
      queryObj.limit = 12;

      const res = await api.get('/products', { params: queryObj });
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch filtered products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (category !== 'all') params.set('category', category);
    if (festival !== 'all') params.set('festival', festival);
    if (state !== 'all') params.set('state', state);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort !== 'newest') params.set('sort', sort);
    params.set('page', '1');

    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setFestival('all');
    setState('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Distinct states from regions
  const availableStates = Array.from(new Set(regionsList.map((r) => r.state)));

  return (
    <div className="explore-page">
      {/* Top Header Banner */}
      <div className="explore-header-banner">
        <div className="container">
          <div className="heritage-pill" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={13} /> Authentic Regional Marketplace
          </div>
          <h1 className="explore-title">Explore Regional Handcrafted Products</h1>
          <p className="explore-sub">
            Discover {pagination.total} handcrafted festive items, temple artifacts, and living cultural crafts.
          </p>
        </div>
      </div>

      <div className="container explore-content-layout">
        {/* Mobile Filter Toggle Button */}
        <div className="mobile-filter-bar">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={16} /> Filters & Sorting
          </button>
          <span className="results-count-mobile">{pagination.total} Products Found</span>
        </div>

        {/* SIDEBAR FILTERS (Desktop & Mobile Drawer) */}
        <aside className={`filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3>Refine Crafts</h3>
            <button
              type="button"
              className="close-mobile-filter"
              onClick={() => setMobileFilterOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Input */}
          <div className="filter-group">
            <label className="form-label">Keyword Search</label>
            <div className="search-box">
              <input
                type="text"
                placeholder="Product, craft, or origin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="form-input"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="form-label">Craft Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
            >
              <option value="all">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat._id} value={cat.slug || cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Festival Filter */}
          <div className="filter-group">
            <label className="form-label">Festive Collection</label>
            <select
              value={festival}
              onChange={(e) => setFestival(e.target.value)}
              className="form-select"
            >
              <option value="all">All Festivals</option>
              {festivalsList.map((fest) => (
                <option key={fest._id} value={fest.slug || fest._id}>
                  {fest.name}
                </option>
              ))}
            </select>
          </div>

          {/* State / Region Filter */}
          <div className="filter-group">
            <label className="form-label">State of Origin</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-select"
            >
              <option value="all">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label className="form-label">Price Range (₹)</label>
            <div className="price-inputs-row">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="form-input price-input"
              />
              <span className="price-dash">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="form-input price-input"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions-row">
            <button
              type="button"
              onClick={applyFilters}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline"
              title="Reset all filters"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </aside>

        {/* MAIN RESULTS AREA */}
        <main className="results-main">
          {/* Top Sort Bar */}
          <div className="results-top-bar">
            <div className="results-count">
              Showing <b>{products.length}</b> of <b>{pagination.total}</b> handcrafted items
            </div>

            <div className="sort-selector-wrapper">
              <span className="sort-label">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  const p = new URLSearchParams(searchParams);
                  p.set('sort', e.target.value);
                  setSearchParams(p);
                }}
                className="form-select sort-select"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
              <p>Fetching regional masterpieces from MongoDB...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-results card">
              <div className="empty-icon">🏺</div>
              <h3>No Handcrafted Products Found</h3>
              <p>We couldn't find any products matching your specific filters. Try expanding your search criteria or resetting filters.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-3">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="pagination-bar">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="btn btn-outline btn-sm"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div className="page-indicators">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => handlePageChange(pNum)}
                    className={`page-num-btn ${pNum === page ? 'active' : ''}`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages}
                className="btn btn-outline btn-sm"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .explore-page {
          padding-bottom: 5rem;
        }
        .explore-header-banner {
          background: linear-gradient(135deg, #FBF8F2 0%, #F5EDE0 100%);
          border-bottom: 1px solid var(--color-border);
          padding: 2.75rem 0;
          margin-bottom: 2.5rem;
        }
        .explore-title {
          font-size: 2.35rem;
          margin-bottom: 0.5rem;
        }
        .explore-sub {
          color: var(--color-text-muted);
          font-size: 1.05rem;
        }

        .explore-content-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        .mobile-filter-bar {
          display: none;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .results-count-mobile {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .filter-sidebar {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--color-border-light);
        }
        .sidebar-header h3 {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-maroon);
        }
        .close-mobile-filter {
          display: none;
          background: none;
          border: none;
          color: var(--color-text-main);
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 1.25rem;
        }
        .price-inputs-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .price-input {
          text-align: center;
        }
        .price-dash {
          color: var(--color-text-muted);
          font-weight: bold;
        }

        .filter-actions-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-light);
        }

        .results-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.75rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .results-count {
          font-size: 0.9rem;
          color: var(--color-text-main);
        }
        .sort-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sort-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .sort-select {
          width: auto;
          padding: 0.4rem 2rem 0.4rem 0.75rem;
          font-size: 0.85rem;
        }

        .loading-state {
          text-align: center;
          padding: 5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--color-text-muted);
        }

        .empty-results {
          text-align: center;
          padding: 4rem 2rem;
        }
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .empty-results h3 {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .empty-results p {
          color: var(--color-text-muted);
          max-width: 450px;
          margin: 0 auto;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 3rem;
        }
        .page-indicators {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .page-num-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .page-num-btn:hover {
          border-color: var(--color-terracotta);
          color: var(--color-terracotta);
        }
        .page-num-btn.active {
          background-color: var(--color-terracotta);
          color: #FFFFFF;
          border-color: var(--color-terracotta);
        }

        @media (max-width: 900px) {
          .explore-content-layout {
            grid-template-columns: 1fr;
          }
          .mobile-filter-bar {
            display: flex;
          }
          .filter-sidebar {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 1000;
            border-radius: 0;
            overflow-y: auto;
          }
          .filter-sidebar.mobile-open {
            display: block;
          }
          .close-mobile-filter {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default ExploreProductsPage;
