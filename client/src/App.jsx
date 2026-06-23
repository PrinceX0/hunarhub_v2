import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellerDashboard from './pages/SellerDashboard';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import RequestService from './pages/RequestService';
import ManageServiceRequests from './pages/ManageServiceRequests';

const AppContent = () => {
  const location = useLocation();
  const hideNavAndFooter = ['/login', '/register'].includes(location.pathname);
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/admin' || location.pathname === '/manage-requests';

  return (
    <>
      {!hideNavAndFooter && !isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/dashboard" element={<SellerDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/request-service/:entrepreneurId" element={<RequestService />} />
        <Route path="/manage-requests" element={<ManageServiceRequests />} />
      </Routes>
      {!hideNavAndFooter && !isDashboard && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
