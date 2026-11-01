import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ExploreProductsPage from './pages/ExploreProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FestivalsPage from './pages/FestivalsPage';
import RegionsPage from './pages/RegionsPage';
import ArtisansPage from './pages/ArtisansPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArtisanRegisterPage from './pages/ArtisanRegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import { ShippingPolicyPage, ReturnPolicyPage, PrivacyPolicyPage } from './pages/PolicyPages';

// Artisan Portal
import ArtisanDashboardPage from './pages/artisan/ArtisanDashboardPage';
import ArtisanProductsPage from './pages/artisan/ArtisanProductsPage';
import ArtisanProductFormPage from './pages/artisan/ArtisanProductFormPage';
import ArtisanOrdersPage from './pages/artisan/ArtisanOrdersPage';
import ArtisanProfilePage from './pages/artisan/ArtisanProfilePage';

// Admin Portal
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminArtisansPage from './pages/admin/AdminArtisansPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminFestivalsPage from './pages/admin/AdminFestivalsPage';
import AdminRegionsPage from './pages/admin/AdminRegionsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <div style={{ flex: 1 }}>
                <Routes>
                  {/* Public Discovery Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ExploreProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/festivals" element={<FestivalsPage />} />
                  <Route path="/regions" element={<RegionsPage />} />
                  <Route path="/artisans" element={<ArtisansPage />} />
                  <Route path="/artisans/:id" element={<ArtisanDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/order-success/:id" element={<OrderSuccessPage />} />

                  {/* Customer Orders & Checkout */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/orders"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'admin']}>
                        <CustomerOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/orders/:id"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'artisan', 'admin']}>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/artisan/register" element={<ArtisanRegisterPage />} />

                  {/* Artisan Portal (Protected: artisan) */}
                  <Route
                    path="/artisan/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['artisan']}>
                        <ArtisanDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/products"
                    element={
                      <ProtectedRoute allowedRoles={['artisan']}>
                        <ArtisanProductsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/products/new"
                    element={
                      <ProtectedRoute allowedRoles={['artisan']}>
                        <ArtisanProductFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/products/edit/:id"
                    element={
                      <ProtectedRoute allowedRoles={['artisan', 'admin']}>
                        <ArtisanProductFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/orders"
                    element={
                      <ProtectedRoute allowedRoles={['artisan']}>
                        <ArtisanOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/artisan/profile"
                    element={
                      <ProtectedRoute allowedRoles={['artisan']}>
                        <ArtisanProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Portal (Protected: admin) */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminProductsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/artisans"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminArtisansPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminCategoriesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/festivals"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminFestivalsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/regions"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminRegionsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminOrdersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Informational & Policy Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="/return-policy" element={<ReturnPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<PrivacyPolicyPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
