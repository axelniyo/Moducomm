import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './modules/auth/AuthContext';
import { ToastProvider, useToast } from './components/Toast';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './modules/auth/Login';
import { ForgotPasswordPage } from './modules/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './modules/auth/ResetPasswordPage';
import RegisterPage from './src/pages/RegisterPage';
import CheckoutPage from './src/modules/checkout/CheckoutPage';
import MerchPage from './src/pages/MerchPage';
import AboutPage from './src/pages/AboutPage';
import TermsPage from './src/pages/TermsPage';
import { ProductList } from './modules/products/ProductList';
import { ProductDetail } from './modules/products/ProductDetail';
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { UserDashboard } from './modules/user/UserDashboard';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Product, Cart, UserRole } from './types';
import { getCart, addItemToCart, removeItemFromCart } from './modules/cart/cartService';

// Helper to get the current location for redirects
const RedirectToLogin = () => {
  const location = useLocation();
  return <Navigate to="/login" state={{ from: location }} replace />;
};

// Wrapper for protected admin routes
const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <RedirectToLogin />;
  if (user?.role !== UserRole.ADMIN) return <Navigate to="/" />;
  return <>{children}</>;
};

// Wrapper for protected user routes
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <RedirectToLogin />;
  return <>{children}</>;
};

const MainApp = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [cart, setCart] = useState<Cart | null>(null);
  useEffect(() => {
    if (isAuthenticated) {
      getCart().then(setCart).catch(err => console.error("Failed to fetch cart", err));
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your cart.', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }
    try {
      const updatedCart = await addItemToCart(product.id, 1);
      setCart(updatedCart);
      showToast(`Added ${product.name} to cart`);
    } catch (error) {
      showToast('Failed to add item to cart', 'error');
    }
  };

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  const Content = (
    <Routes>
      {/* Specific Routes */}
      <Route path="/" element={<MerchPage />} />
      <Route path="/products" element={<ProductList onAddToCart={handleAddToCart} />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Catch-All Route for Spreadshop Products - MUST BE LAST */}
      <Route path="/*" element={<MerchPage />} />
    </Routes>
  );

  if (isAuthPage) return Content;

  return (
    <Layout 
      onNotificationClick={() => setIsNotificationsOpen(true)}
      notificationCount={0}
    >
      <ErrorBoundary moduleName="Main Content">{Content}</ErrorBoundary>
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
