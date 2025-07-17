import React from "react";
import { useFavorites } from "../context/FavoriteContext";
import ProductCard from "../components/ProductCard";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Favorilerim</h2>
      {favorites.length === 0 ? (
        <p>Henüz favori ürün eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
