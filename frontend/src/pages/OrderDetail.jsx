// frontend/src/pages/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchOrderDetail } from "../api/orderApi"; // Bu fonksiyonu backend API çağrısı için kullanıyoruz

const OrderDetail = () => {
  const { id } = useParams(); // URL'den sipariş ID'sini alıyoruz
  const navigate = useNavigate();
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!authLoading && isAuthenticated && token && id) {
      const getOrderDetail = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchOrderDetail(id, token); // Sipariş ID'si ve token ile API çağrısı yapıyoruz
          setOrder(data);
        } catch (err) {
          console.error("Sipariş detayı alınırken hata:", err);
          setError(err.message || "Sipariş detayı yüklenirken bir hata oluştu.");
        } finally {
          setLoading(false);
        }
      };
      getOrderDetail();
    }
  }, [authLoading, isAuthenticated, token, id, navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Beklemede";
      case "preparing":
        return "Hazırlanıyor";
      case "shipped":
        return "Kargoya Verildi";
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <p>Sipariş detayları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Sipariş Detayı</h1>
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
        >
          Sipariş Geçmişine Dön
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Sipariş Detayı</h1>
        <p>Sipariş bulunamadı.</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
        >
          Sipariş Geçmişine Dön
        </button>
      </div>
    );
  }

  // Backend API'nizin temel URL'sini ortam değişkeninden alın
  // VEYA varsayılan olarak http://localhost:5000 kullanın
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Sipariş Detayı</h1>
        <button
          onClick={() => navigate("/orders")}
          className="mb-6 inline-flex items-center text-blue-400 hover:underline"
        >
          &larr; Sipariş Geçmişine Dön
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-3 text-green-400">Sipariş Bilgileri</h2>
            <p>
              <strong className="text-gray-400">Sipariş No:</strong> {order._id}
            </p>
            <p>
              <strong className="text-gray-400">Tarih:</strong> {formatDate(order.createdAt)}
            </p>
            <p>
              <strong className="text-gray-400">Durum:</strong>{" "}
              <span
                className={`font-semibold ${
                  order.status === "delivered" ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {getStatusText(order.status)}
              </span>
            </p>
            <p>
              <strong className="text-gray-400">Toplam Tutar:</strong> ₺{order.totalPrice?.toFixed(2)}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 text-green-400">Kargo Bilgileri</h2>
            <p>
              <strong className="text-gray-400">Başlık:</strong> {order.shippingInfo?.title}
            </p>
            <p>
              <strong className="text-gray-400">Alıcı:</strong> {order.shippingInfo?.fullName}
            </p>
            <p>
              <strong className="text-gray-400">Adres:</strong> {order.shippingInfo?.addressLine1} {order.shippingInfo?.addressLine2}
            </p>
            <p>
              <strong className="text-gray-400">Şehir/Eyalet:</strong> {order.shippingInfo?.city}, {order.shippingInfo?.state}
            </p>
            <p>
              <strong className="text-gray-400">Posta Kodu:</strong> {order.shippingInfo?.postalCode}
            </p>
            <p>
              <strong className="text-gray-400">Ülke:</strong> {order.shippingInfo?.country}
            </p>
            <p>
              <strong className="text-gray-400">Telefon:</strong> {order.shippingInfo?.phone}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-green-400">Ürünler</h2>
        {order.products && order.products.length > 0 ? (
          <div className="space-y-4">
            {order.products.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center bg-gray-700 rounded-lg p-3 shadow-sm"
              >
                {/* Ürün Görseli BURADA GÖSTERİLİYOR */}
                {item.product.images && item.product.images.length > 0 ? (
                  <img
                    src={`${API_BASE_URL}${item.product.images[0].url}`} // Backend URL'si ile görsel yolunu birleştiriyoruz
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                ) : (
                  <img
                    src="https://dummyimage.com/60x60/ccc/fff&text=No+Image" // GÜNCELLENDİ: Daha güvenilir varsayılan resim URL'si
                    alt="No Image Available"
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-300 text-sm">Adet: {item.quantity}</p>
                  <p className="text-gray-300 text-sm">Fiyat: ₺{item.price?.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₺{(item.price * item.quantity)?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Bu sipariş için ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;