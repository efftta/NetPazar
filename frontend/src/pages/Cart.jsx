import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Sepetim</h1>

      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400">Sepetiniz boş.</p>
          <Link
            to="/products"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-4 rounded flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4 w-full md:w-2/3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-400">
                    {(item.discountPrice || item.price).toFixed(2)} TL
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-600 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gray-600 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:underline"
              >
                Kaldır
              </button>
            </div>
          ))}

          <div className="mt-6 text-right text-lg font-bold text-green-400">
            Toplam: {total.toFixed(2)} TL
          </div>

          <div className="mt-4 flex justify-between flex-col md:flex-row gap-4">
            <button
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Sepeti Temizle
            </button>
            <Link
              to="/payment"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center"
            >
              Ödemeye Geç
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
