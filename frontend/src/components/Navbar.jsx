import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  ShoppingCart,
  User,
  Heart,
  ClipboardList,
  MapPin,
  CreditCard,
  Tag,
  Gift,
  Sparkles,
  TrendingUp,
  HelpCircle,
  LogOut,
  LayoutGrid,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [language, setLanguage] = useState("TR");
  const accountRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const categoriesRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Mobil menüyü kapatmak için dışarı tıklama dedektörü
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Eğer tıklanan element mobil menü butonu değilse ve menü açıksa
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        event.target.closest("#mobile-menu-button") === null
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Hesabım dropdown menüsünü kapatmak için dışarı tıklama dedektörü
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountOpen]);

  // Kategoriler dropdown menüsünü kapatmak için dışarı tıklama dedektörü
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };
    if (categoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoriesOpen]);

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate("/login");
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    console.log(`Dil ${lang} olarak değiştirildi.`);
  };

  const categories = [
    { name: "Elektronik", path: "/products?category=Elektronik" },
    { name: "Ev & Yaşam", path: "/products?category=Ev+%26+Ya%C5%9Fam" },
    { name: "Moda", path: "/products?category=Moda" },
    { name: "Kitap, Müzik, Film, Oyun", path: "/products?category=Kitap%2C+M%C3%BCzik%2C+Film%2C+Oyun" },
    { name: "Spor & Outdoor", path: "/products?category=Spor+%26+Outdoor" },
    { name: "Kozmetik", path: "/products?category=Kozmetik" },
    { name: "Anne & Çocuk", path: "/products?category=Anne+%26+%C3%87ocuk" },
    { name: "Süpermarket", path: "/products?category=S%C3%BCpermarket" },
    { name: "Otomotiv", path: "/products?category=Otomotiv" },
    { name: "Bahçe & Yapı Market", path: "/products?category=Bah%C3%A7e+%26+Yap%C4%B1+Market" },
  ];

  const primaryNavLinks = [
    { name: "Yeni Ürünler", path: "/products?filter=new", icon: Sparkles },
    { name: "Kampanyalar", path: "/products?filter=campaign", icon: Gift },
    { name: "Çok Satanlar", path: "/products?filter=bestseller", icon: TrendingUp },
  ];

  const renderMobileNavLinks = () => (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <button
          onClick={() => setCategoriesOpen(!categoriesOpen)}
          className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2 w-full justify-start"
          aria-expanded={categoriesOpen}
          aria-haspopup="true"
        >
          <LayoutGrid size={20} className="mr-2" />
          <span className="font-semibold">Kategoriler</span>
          <ChevronDown size={16} className={`ml-auto transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
        </button>

        {categoriesOpen && (
          <div
            className={`mt-2 py-2 rounded-md shadow-inner ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block px-4 py-2 text-base hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  setCategoriesOpen(false);
                  setMenuOpen(false);
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {primaryNavLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          onClick={() => setMenuOpen(false)}
        >
          <link.icon size={20} className="mr-2" />
          {link.name}
        </Link>
      ))}
    </div>
  );

  return (
    <nav
      className={`py-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-md sticky top-0 z-40`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        {/* Sol Taraf: Kategoriler, Yeni Ürünler, Kampanyalar (Masaüstü) */}
        <div className="flex items-center space-x-6">
          {/* Kategoriler Dropdown (Masaüstü) */}
          <div className="relative hidden md:block" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onMouseEnter={() => setCategoriesOpen(true)}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2"
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
            >
              <LayoutGrid size={24} className="mr-2" />
              <span className="font-semibold">Kategoriler</span>
              <ChevronDown size={16} className={`ml-1 transition-transform ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className={`absolute left-0 mt-2 py-2 w-64 rounded-md shadow-lg z-50 transform ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Diğer Ana Linkler (Masaüstü) */}
          <div className="hidden md:flex items-center space-x-6">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Orta Kısım: Logo ve Arama Çubuğu */}
        {/* Mobil görünümde flex-grow alarak daha fazla yer kaplar, ikonlar sağa itilir */}
        <div className="flex-1 flex flex-col items-center mx-auto md:max-w-xs md:mt-0">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                             mt-0 mb-1 tracking-wide drop-shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            NetPazar
          </Link>
          {/* Arama Çubuğu */}
          <div className="w-full mt-0">
            <SearchBar className="h-7 text-sm" />
          </div>
        </div>

        {/* Sağ taraf ikonları */}
        {/* Mobil görünümde ikonları sağa yaslamak için ml-auto kullanıldı */}
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
          {/* Tema değiştirme butonu (Masaüstü ve Mobil) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600 focus:ring-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-800"
            }`}
            aria-label={theme === "dark" ? "Aydınlık moda geç" : "Karanlık moda geç"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Sepet İkonu */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Hesabım Dropdown (Masaüstü) */}
          <div className="relative hidden md:block" ref={accountRef}>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-2"
              aria-expanded={accountOpen}
              aria-haspopup="true"
            >
              <User size={24} />
              <ChevronDown size={16} className={`ml-1 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
            </button>

            {accountOpen && (
              <div
                className={`absolute right-0 mt-2 py-2 w-48 rounded-md shadow-lg z-50 ${
                  theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm font-semibold border-b border-gray-600 dark:border-gray-700">
                      Merhaba, {user?.username || user?.firstName || "Kullanıcı"}!
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      <User size={18} className="mr-2" /> Profilim
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      <ClipboardList size={18} className="mr-2" /> Siparişlerim
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      <Heart size={18} className="mr-2" /> Favorilerim
                    </Link>
                    <Link
                      to="/addresses"
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      <MapPin size={18} className="mr-2" /> Adreslerim
                    </Link>
                    <Link
                      to="/payment-methods"
                      className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      <CreditCard size={18} className="mr-2" /> Ödeme Yöntemleri
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                        onClick={() => setAccountOpen(false)}
                      >
                        <User size={18} className="mr-2" /> Admin Paneli
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white rounded-b-md"
                    >
                      <LogOut size={18} className="mr-2" /> Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm hover:bg-blue-500 hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      Kaydol
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <button
            id="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobil Menü İçeriği */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute top-0 left-0 w-64 min-h-screen z-50 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } shadow-lg p-5 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-2xl font-bold text-blue-500">
            NetPazar
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            aria-label="Menüyü kapat"
          >
            <X size={28} />
          </button>
        </div>

        {/* Mobil Arama Çubuğu (Menü içinde) */}
        <div className="w-full mb-4">
          <SearchBar className="h-9 text-base" />
        </div>

        {renderMobileNavLinks()}

        <hr className="my-6 border-gray-600 dark:border-gray-700" />

        {/* Mobil Hesabım Menüsü */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Hesabım</h3>
          {isAuthenticated ? (
            <>
              <span className="text-lg font-semibold text-blue-400">
                Merhaba, {user?.username || user?.firstName || "Kullanıcı"}!
              </span>
              <Link
                to="/profile"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} className="mr-2" /> Profilim
              </Link>
              <Link
                to="/orders"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <ClipboardList size={20} className="mr-2" /> Siparişlerim
              </Link>
              <Link
                to="/favorites"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <Heart size={20} className="mr-2" /> Favorilerim
              </Link>
              <Link
                to="/addresses"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <MapPin size={20} className="mr-2" /> Adreslerim
              </Link>
              <Link
                to="/payment-methods"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <CreditCard size={20} className="mr-2" /> Ödeme Yöntemleri
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={20} className="mr-2" /> Admin Paneli
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left text-lg text-red-500 hover:text-red-600 mt-4"
              >
                <LogOut size={20} className="mr-2" /> Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} className="mr-2" /> Giriş Yap
              </Link>
              <Link
                to="/register"
                className="flex items-center text-lg text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} className="mr-2" /> Kaydol
              </Link>
            </>
          )}
        </div>

        <hr className="my-6 border-gray-600 dark:border-700" />

        {/* Tema değiştirme butonu (Mobil) */}
        <button
          onClick={toggleTheme}
          className={`mt-5 px-6 py-2 rounded-md transition font-semibold flex items-center justify-center gap-2 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          aria-label={theme === "dark" ? "Aydınlık moda geç" : "Karanlık moda geç"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          {theme === "dark" ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;