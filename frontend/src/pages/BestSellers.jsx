import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProductsByFilter } from "../api/productApi";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Burada filtre ismi backend ile uyumlu mu kontrol et isBestSeller mi yoksa bestSeller mı
    fetchProductsByFilter("isBestSeller", "true")
      .then((data) => setBestSellers(data))
      .catch((err) => {
        console.error("Çok satan ürünler alınamadı:", err);
        setBestSellers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Çok Satan Ürünler</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : bestSellers.length === 0 ? (
        <p>Çok satan ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSellers;