import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const Campaigns = () => {
  const [campaignProducts, setCampaignProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Eğer backend filtresi farklıysa (örneğin isCampaign), ona göre değiştir
    fetch("/api/products?isCampaign=true")
      .then((res) => res.json())
      .then((data) => {
        setCampaignProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Kampanya ürünleri alınırken hata:", error);
        setCampaignProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Kampanyalı Ürünler</h1>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : campaignProducts.length === 0 ? (
        <p>Kampanya ürünü bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {campaignProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} showDiscount />
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;