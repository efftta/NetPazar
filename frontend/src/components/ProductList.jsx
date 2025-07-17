import React from "react";
import { Heart } from "lucide-react";

const ProductList = ({ products, onToggleFavorite }) => {
  return (
    <>
      {products.length === 0 && (
        <p className="text-center text-gray-400 col-span-full">
          Ürün bulunamadı.
        </p>
      )}

      {products.map((product) => (
        <div
          key={product._id}
          className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition relative"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-400">{product.category}</p>
          <p className="mt-2 text-xl font-bold">
            {product.discountPrice ? (
              <>
                <span className="line-through text-gray-500 mr-2">
                  {product.price.toFixed(2)} ₺
                </span>
                <span className="text-green-400">
                  {product.discountPrice.toFixed(2)} ₺
                </span>
              </>
            ) : (
              <span>{product.price.toFixed(2)} ₺</span>
            )}
          </p>

          <button
            onClick={() => onToggleFavorite(product)}
            className={`absolute top-4 right-4 transition ${
              product.isFavorite ? "text-red-600" : "text-red-400 hover:text-red-600"
            }`}
            aria-label="Favorilere ekle"
          >
            <Heart size={24} />
          </button>
        </div>
      ))}
    </>
  );
};

export default ProductList;
