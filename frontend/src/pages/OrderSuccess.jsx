import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, totalPrice } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-lg text-center">
        <CheckCircle className="text-green-500 mx-auto" size={72} />
        <h1 className="text-3xl font-bold mt-4 mb-2">Sipariş Başarıyla Oluşturuldu!</h1>

        {orderId && (
          <p className="text-gray-300 mt-2">
            <span className="font-semibold">Sipariş No:</span> {orderId}
          </p>
        )}
        {totalPrice && (
          <p className="text-gray-300 mb-4">
            <span className="font-semibold">Toplam Tutar:</span> ₺{totalPrice.toFixed(2)}
          </p>
        )}

        <p className="text-gray-400 mb-6">
          Siparişinizi "Siparişlerim" sayfasından takip edebilirsiniz.
        </p>

        <Link
          to="/orders"
          className="inline-block bg-green-500 hover:bg-green-600 transition-colors text-white font-semibold py-2 px-4 rounded-xl"
        >
          Siparişlerim
        </Link>
        <Link
          to="/"
          className="ml-4 inline-block text-gray-300 hover:text-white transition-colors"
        >
          Anasayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
