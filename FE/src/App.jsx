import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import FloatingContact from './components/FloatingContact/FloatingContact';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage/OrderSuccessPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage/BlogDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PolicyPage/PrivacyPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/PolicyPage/ReturnPolicyPage'));
const AdminPage = lazy(() => import('./pages/AdminPage/AdminPage'));

// Loading fallback
const PageLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '1rem',
    background: '#F5F0E8',
  }}>
    <div style={{ fontSize: '2.5rem', animation: 'float 1.5s ease-in-out infinite' }}>☕</div>
    <p style={{ color: '#6B5744', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>
      Đang tải...
    </p>
  </div>
);

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// 404 Not Found
const NotFoundPage = () => (
  <div style={{
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    textAlign: 'center',
    padding: '2rem',
    background: '#F5F0E8',
  }}>
    <div style={{ fontSize: '5rem' }}>☕</div>
    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#2C1810' }}>
      404 - Trang Không Tìm Thấy
    </h1>
    <p style={{ color: '#6B5744', maxWidth: '400px' }}>
      Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
    </p>
    <a href="/" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.85rem 2rem',
      background: '#C8A96E',
      color: '#2C1810',
      borderRadius: '9999px',
      fontWeight: '700',
      textDecoration: 'none',
      fontSize: '0.9rem',
    }}>
      Về trang chủ
    </a>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham" element={<ShopPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
          <Route path="/ve-chung-toi" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
          <Route path="/chinh-sach-doi-tra" element={<ReturnPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <FloatingContact />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            borderRadius: '12px',
            background: '#fff',
            color: '#2C1810',
            boxShadow: '0 8px 32px rgba(44,24,16,0.15)',
          },
          success: {
            iconTheme: { primary: '#C8A96E', secondary: '#2C1810' },
          },
          duration: 3000,
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
