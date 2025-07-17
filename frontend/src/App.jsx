import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Bileşenler
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Sayfalar
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import AdminPanel from "./pages/AdminPanel";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Addresses from "./pages/Addresses";
import PaymentMethods from "./pages/PaymentMethods";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetail from "./pages/OrderDetail";

// Yeni sayfalar
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ResetPassword from "./pages/ResetPassword";

// Context sağlayıcıları
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

// Özel rota bileşeni
import PrivateRoute from "./components/PrivateRoute";

// Sayfa değişiminde en üste kaydırmak için
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <FavoriteProvider>
          <CartProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />

                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route
                      path="/payment"
                      element={
                        <PrivateRoute>
                          <Payment />
                        </PrivateRoute>
                      }
                    />

                    <Route path="/order-success" element={<OrderSuccess />} />

                    <Route
                      path="/orders"
                      element={
                        <PrivateRoute>
                          <OrderHistory />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/order/:id"
                      element={
                        <PrivateRoute>
                          <OrderDetail />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/favorites"
                      element={
                        <PrivateRoute>
                          <Favorites />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/addresses"
                      element={
                        <PrivateRoute>
                          <Addresses />
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/payment-methods"
                      element={
                        <PrivateRoute>
                          <PaymentMethods />
                        </PrivateRoute>
                      }
                    />

                    {/* Admin panel sadece admin rolüne açık */}
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute requiredRole="admin">
                          <AdminPanel />
                        </PrivateRoute>
                      }
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </CartProvider>
        </FavoriteProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
