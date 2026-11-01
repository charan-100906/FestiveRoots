import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2, Sparkles, Info, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ArtisanProductFormPage = () => {
  const { id } = useParams(); // If present, edit mode!
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamic taxonomies loaded from MongoDB
  const [categories, setCategories] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [regions, setRegions] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    festivalId: '',
    craftType: '',
    claimedOrigin: '',
    state: '',
    district: '',
    townVillage: '',
    stock: 1,
    isMadeToOrder: false,
    preparationTimeDays: 3,
    estimatedDispatchDays: 5,
    images: ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80']
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load Categories, Festivals, and Regions from Database
  useEffect(() => {
    const fetchTaxonomiesAndProduct = async () => {
      try {
        const [catsRes, festsRes, regsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/festivals'),
          api.get('/regions')
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.data);
        if (festsRes.data.success) setFestivals(festsRes.data.data);
        if (regsRes.data.success) setRegions(regsRes.data.data);

        // If edit mode, load product details
        if (isEditMode) {
          const prodRes = await api.get(`/products/${id}`);
          if (prodRes.data.success) {
            const p = prodRes.data.data;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              price: p.price || '',
              originalPrice: p.originalPrice || '',
              categoryId: p.category?._id || p.category || '',
              festivalId: p.festival?._id || p.festival || '',
              craftType: p.craftType || '',
              claimedOrigin: p.claimedOrigin || '',
              state: p.state || '',
              district: p.district || '',
              townVillage: p.townVillage || '',
              stock: p.stock ?? 1,
              isMadeToOrder: Boolean(p.isMadeToOrder),
              preparationTimeDays: p.preparationTimeDays || 3,
              estimatedDispatchDays: p.estimatedDispatchDays || 5,
              images: p.images?.length > 0 ? p.images : ['https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80']
            });
          }
        } else {
          // Pre-populate with first category if available
          if (catsRes.data.data?.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: catsRes.data.data[0]._id }));
          }
        }
      } catch (err) {
        console.error('Failed to load taxonomies or product data:', err);
        setError('Failed to load required taxonomies from database');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchTaxonomiesAndProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add Image URL to array
  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  // Remove Image URL from array
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Upload image file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await api.post('/products/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, res.data.url]
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.categoryId || !formData.craftType || !formData.claimedOrigin) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        const res = await api.put(`/products/${id}`, formData);
        if (res.data.success) {
          setSuccessMsg('Product updated successfully! If key details changed, it has been resubmitted for admin approval.');
          setTimeout(() => navigate('/artisan/products'), 1500);
        }
      } else {
        const res = await api.post('/products', formData);
        if (res.data.success) {
          setSuccessMsg('Product created successfully and submitted to the administrator queue for approval!');
          setTimeout(() => navigate('/artisan/products'), 1500);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ color: 'var(--color-terracotta)', width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  return (
    <div className="artisan-product-form-page" style={{ padding: '3rem 0 6rem' }}>
      <div className="container container-narrow" style={{ maxWidth: '780px' }}>
        <Link to="/artisan/products" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Products List
        </Link>

        <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div className="heritage-pill" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={13} /> {isEditMode ? 'Modify Catalog Entry' : 'New Regional Handicraft Listing'}
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--color-maroon)' }}>
              {isEditMode ? `Edit: ${formData.name}` : 'List a New Handcrafted Product'}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Newly listed products are saved directly to MongoDB and queued for administrator verification before public display.
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            {/* 1. Basic Details */}
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', marginBottom: '1rem' }}>
              1. Title & Classification
            </h3>

            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kondapalli Raja-Rani Dancing Dolls Set"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Craft Category (from Database) *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Festive Association (Optional)</label>
                <select
                  name="festivalId"
                  value={formData.festivalId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">No Specific Festival / All-Season</option>
                  {festivals.map((fest) => (
                    <option key={fest._id} value={fest._id}>
                      {fest.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the craft tradition, materials used (e.g. natural dyes, riverbed clay, softwood), handcrafting process, and dimensions..."
                className="form-textarea"
                required
              ></textarea>
            </div>

            {/* 2. Craft Type & Regional Origin */}
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', margin: '1.75rem 0 1rem' }}>
              2. Craft Technique & Claimed Origin
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Craft Type / Technique *</label>
                <input
                  type="text"
                  name="craftType"
                  value={formData.craftType}
                  onChange={handleChange}
                  placeholder="e.g. Softwood Carving, Lost-Wax Dokra Casting, Blue Pottery"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Claimed Regional Origin *</label>
                <input
                  type="text"
                  name="claimedOrigin"
                  value={formData.claimedOrigin}
                  onChange={handleChange}
                  placeholder="e.g. Kondapalli Village, Krishna District, Andhra Pradesh"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Andhra Pradesh"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Krishna"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Town / Village</label>
                <input
                  type="text"
                  name="townVillage"
                  value={formData.townVillage}
                  onChange={handleChange}
                  placeholder="e.g. Kondapalli"
                  className="form-input"
                />
              </div>
            </div>

            {/* 3. Pricing, Inventory & Timings */}
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', margin: '1.75rem 0 1rem' }}>
              3. Pricing, Inventory & Timings
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Selling Price (₹ INR) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 1850"
                  min="1"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original / MRP Price (₹ Optional)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 2200"
                  min="0"
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Available Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="form-input"
                  disabled={formData.isMadeToOrder}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="isMadeToOrder"
                    checked={formData.isMadeToOrder}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Product is Made-to-Order</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Handcrafting Preparation Time (Days)</label>
                <input
                  type="number"
                  name="preparationTimeDays"
                  value={formData.preparationTimeDays}
                  onChange={handleChange}
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Dispatch from Workshop (Days)</label>
                <input
                  type="number"
                  name="estimatedDispatchDays"
                  value={formData.estimatedDispatchDays}
                  onChange={handleChange}
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            {/* 4. Product Images */}
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-maroon)', margin: '1.75rem 0 1rem' }}>
              4. Product Photographs
            </h3>

            <div className="form-group">
              <label className="form-label">Add Image by Web URL</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn btn-outline"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Or Upload Image File from Local Computer</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="form-input"
              />
              {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--color-terracotta)' }}>Uploading image to server static uploads...</span>}
            </div>

            {/* Image Previews */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1rem 0 1.5rem' }}>
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={imgUrl} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {loading ? 'Saving Listing to MongoDB...' : isEditMode ? 'Update Product Listing' : 'Submit Handcrafted Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProductFormPage;
