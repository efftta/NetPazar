import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProductsByFilter } from "../api/productApi";

const Suggestions = () => {
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByFilter("isRecommended", "true")
      .then((data) => {
        // Her kategori için yalnızca bir ürün al
        const uniqueByCategory = {};
        data.forEach((product) => {
          const cat = product.category?.name || product.category;
          if (!uniqueByCategory[cat]) {
            uniqueByCategory[cat] = product;
          }
        });
        setSuggested(Object.values(uniqueByCategory));
      })
      .catch((err) => {
        console.error("Önerilen ürünler alınırken hata:", err);
        setSuggested([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Önerilen Ürünler</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : suggested.length === 0 ? (
        <p>Önerilen ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {suggested.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
