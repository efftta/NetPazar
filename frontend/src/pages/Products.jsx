import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // useLocation'a artık ihtiyaç kalmadı
import ProductCard from "../components/ProductCard";
import { fetchProductsByParams } from "../api/productApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(""); // Bu state'i kategori filtrelemesi için tutmaya devam ediyoruz
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();

  // URL'deki parametreleri dinle ve state'leri güncelle
  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "";
    setFilter(urlFilter);

    // Kategori parametresini de URL'den alıyoruz, eğer varsa
    const urlCategory = searchParams.get("category") || "";
    setCategory(urlCategory);

  }, [searchParams]); // searchParams değiştiğinde çalışır

  // Ürünleri fetch etme işlemi
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        // Kategori filtresi
        if (category) params.category = category;

        // Diğer filtreler
        if (filter === "bestseller") params.isBestSeller = "true";
        if (filter === "campaign") params.isCampaign = "true";
        if (filter === "new") params.isNewProduct = "true";

        // Arama terimi
        const currentSearchQuery = searchParams.get("search");
        if (currentSearchQuery) {
          params.search = currentSearchQuery;
        }

        const fetchedProducts = await fetchProductsByParams(params);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Ürünler yüklenirken hata:", err);
        setError("Ürünler yüklenirken bir hata oluştu.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, filter, searchParams]); // category bağımlılığı da eklendi

  // Filtre butonlarının dinamik sınıflandırması
  const getFilterButtonClass = (buttonFilter) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      filter === buttonFilter
        ? "bg-blue-600 text-white" // Aktif filtre
        : "bg-gray-700 hover:bg-gray-600 text-white" // Pasif filtre
    }`;

  return (
    <div className="container mx-auto p-4 text-white min-h-screen">
      {/* Kategori Listesi Bileşeni Kaldırıldı */}
      {/* <CategoryList onCategorySelect={setCategory} selectedCategory={category} /> */}

      {/* Ana filtre butonları (Kampanyalar, Çok Satanlar, Yeni Ürünler) */}
      <div className="flex gap-4 my-4 flex-wrap">
        {[
          { label: "Tümü", value: "" },
          { label: "Kampanyalar", value: "campaign" },
          { label: "Çok Satanlar", value: "bestseller" },
          { label: "Yeni Ürünler", value: "new" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={getFilterButtonClass(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-lg mt-10">Ürünler yükleniyor...</p>}
      {error && <p className="text-center text-red-500 text-lg mt-10">Hata: {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-lg mt-10">Aradığınız kriterlere uygun ürün bulunamadı.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {!loading &&
          !error &&
          products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </div>
  );
};

export default Products;