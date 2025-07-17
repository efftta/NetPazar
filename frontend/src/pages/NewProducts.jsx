import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";

const NewProducts = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?isNew=true")
      .then((res) => res.json())
      .then((data) => {
        setNewProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Yeni ürünler alınırken hata:", error);
        setNewProducts([]);
        setLoading(false);
      });
  }, []);

  const handleToggleFavorite = (product) => {
    // Buraya favorilere ekleme fonksiyonu gelecek (isteğe bağlı)
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Yeni Ürünler</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ProductList products={newProducts} onToggleFavorite={handleToggleFavorite} />
        </div>
      )}
    </div>
  );
};

export default NewProducts;
