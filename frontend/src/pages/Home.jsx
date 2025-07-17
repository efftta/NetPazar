import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilter } from "../api/productApi";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoriteContext";
import { useTheme } from "../context/ThemeContext";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [campaignProducts, setCampaignProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const { toggleFavorite, favorites } = useFavorites();
  const navigate = useNavigate();

  const { theme } = useTheme();

  const [language, setLanguage] = useState("TR"); // Mevcut dil seçimi state'i

  // BASE_SERVER_URL'i ProductCard.jsx'teki gibi tanımlayalım
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
  const BASE_SERVER_URL = API_BASE_URL.includes('/api') ? API_BASE_URL.replace('/api', '') : API_BASE_URL;

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByFilter("category", selectedCategory)
        .then((data) => {
          setCampaignProducts(data.filter((p) => p.isCampaign));
          setBestSellers(data.filter((p) => p.isBestSeller));
          setNewProducts(data.filter((p) => p.isNewProduct));
        })
        .catch(console.error);
    } else {
      fetchProductsByFilter("isCampaign", "true").then(setCampaignProducts).catch(console.error);
      fetchProductsByFilter("isBestSeller", "true").then(setBestSellers).catch(console.error);
      fetchProductsByFilter("isNewProduct", "true").then(setNewProducts).catch(console.error);
    }
  }, [selectedCategory]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const renderProductCard = (product) => {
    const isFavorited = favorites.some((item) => item._id === product._id);
    return (
      <motion.div
        key={product._id}
        className={`p-4 rounded-xl shadow hover:shadow-lg transition relative cursor-pointer ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-100"
        }`}
        variants={cardVariants}
        onClick={() => navigate(`/product/${product._id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate(`/product/${product._id}`);
        }}
      >
        <img
          // BURASI DÜZELTİLDİ: product.image yerine product.images[0].url kullanıldı
          src={product.images && product.images.length > 0
            ? `${BASE_SERVER_URL}${product.images[0].url}`
            : "https://dummyimage.com/400x300/ccc/fff&text=Urun+Gorseli+Mevcut+Degil"} // Fallback görsel
          alt={product.name}
          className="w-full h-48 object-cover rounded"
          loading="lazy"
        />
        <h3 className={`text-base font-medium mt-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
          {product.name}
        </h3>
        <p className={`text-sm line-through ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {product.discountPrice ? `${product.price.toFixed(2)} ₺` : ""}
        </p>
        <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
          {(product.discountPrice || product.price).toFixed(2)} ₺
        </p>
        <button
          className={`absolute top-3 right-3 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            isFavorited ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          aria-label={isFavorited ? "Favorilerden çıkar" : "Favorilere ekle"}
        >
          {isFavorited ? "♥" : "♡"}
        </button>
      </motion.div>
    );
  };

  const Section = ({ title, products, filterKey }) => (
    <section className="mt-10">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className={`${theme === "dark" ? "text-white" : "text-black"} text-xl font-semibold`}>
          {title}
        </h2>
        <button onClick={() => navigate(`/products?filter=${filterKey}`)} className="text-blue-400 hover:underline">
          Tümünü Gör
        </button>
      </div>
      {products.length === 0 ? (
        <p className={theme === "dark" ? "text-gray-500" : "text-gray-700"}>Bu bölümde ürün bulunamadı.</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        >
          {products.slice(0, 8).map(renderProductCard)}
        </motion.div>
      )}
    </section>
  );

  return (
    <div
      className={`min-h-screen px-4 py-6 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 to-black text-white"
          : "bg-white text-black"
      }`}
    >
      {/* Kategori Listesi - Bu satır kaldırıldı */}
      {/* <CategoryList onCategorySelect={setSelectedCategory} /> */}

      {/* Ürün bölümleri */}
      <Section title="Kampanyalı Ürünler" products={campaignProducts} filterKey="campaign" />
      <Section title="Çok Satanlar" products={bestSellers} filterKey="bestseller" />
      <Section title="Yeni Ürünler" products={newProducts} filterKey="new" />
    </div>
  );
};

export default Home;