import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUserOrders, cancelOrderApi } from "../api/orderApi";

const STATUS_STEPS = [
  { status: "pending", label: "Beklemede", color: "text-yellow-400" },
  { status: "shipped", label: "Kargoya Verildi", color: "text-blue-400" },
  { status: "on_the_way", label: "Yola Çıktı", color: "text-green-400" },
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, isAuthenticated, loading: authLoading } = useAuth();

  const [ordersStatus, setOrdersStatus] = useState({});
  const timersRef = useRef({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!authLoading && isAuthenticated && token) {
      const getOrders = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchUserOrders(token);
          setOrders(data);

          // Başlangıç durumlarını belirle
          const initialStatuses = {};
          data.forEach((order) => {
            if (order.status === "cancelled") {
              initialStatuses[order._id] = -1; // İptal edildi
            } else if (order.status === "delivered") {
              initialStatuses[order._id] = STATUS_STEPS.length; // Teslim edildi, animasyon sonu
            } else {
              initialStatuses[order._id] = 0; // Beklemede (Animasyon başı)
            }
          });
          setOrdersStatus(initialStatuses);
        } catch (err) {
          console.error("Sipariş geçmişi alınırken hata:", err);
          setError(err.message || "Sipariş geçmişi yüklenirken bir hata oluştu.");
        } finally {
          setLoading(false);
        }
      };
      getOrders();
    }
  }, [authLoading, isAuthenticated, token, navigate]);

  useEffect(() => {
    // Her sipariş için durum animasyonunu tetikle
    Object.entries(ordersStatus).forEach(([orderId, statusIndex]) => {
      if (statusIndex === -1 || statusIndex >= STATUS_STEPS.length) {
        // İptal edilen veya teslim edilen siparişlerde timer kurma
        return;
      }
      if (timersRef.current[orderId]) {
        clearTimeout(timersRef.current[orderId]);
      }
      timersRef.current[orderId] = setTimeout(() => {
        setOrdersStatus((prev) => {
          if (prev[orderId] === -1 || prev[orderId] >= STATUS_STEPS.length) return prev;

          const newIndex = prev[orderId] + 1;
          return {
            ...prev,
            [orderId]: newIndex,
          };
        });
      }, 10000); // 10 saniye sonra durum güncellenir
    });

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, [ordersStatus]);

  const handleCancelOrder = async (orderId) => {
    try {
      if (token) {
        await cancelOrderApi(orderId, token);
      }

      // Durumu iptal olarak güncelle
      setOrdersStatus((prev) => ({
        ...prev,
        [orderId]: -1,
      }));

      // Sipariş listesindeki durumu iptal olarak değiştir
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      alert("Siparişi iptal ederken bir hata oluştu.");
      console.error(err);
    }
  };

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
        <p>Sipariş geçmişi yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Sipariş Geçmişi</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">Henüz siparişiniz bulunmamaktadır.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          {orders.map((order) => {
            const statusIndex = ordersStatus[order._id] ?? 0;

            let statusLabel = "Bilinmiyor";
            let statusColor = "text-gray-400";

            if (statusIndex === -1) {
              statusLabel = "İptal Edildi";
              statusColor = "text-red-500";
            } else if (statusIndex >= STATUS_STEPS.length) {
              statusLabel = "Teslim Edildi";
              statusColor = "text-green-400";
            } else {
              statusLabel = STATUS_STEPS[statusIndex].label;
              statusColor = STATUS_STEPS[statusIndex].color;
            }

            return (
              <div
                key={order._id}
                className="bg-gray-800 rounded-xl shadow-md p-4 hover:ring-2 hover:ring-green-400 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-lg font-semibold">Sipariş No: {order._id}</p>
                    <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">
                      Ürün Sayısı: {order.products?.length || 0}
                    </p>
                    <p className="text-sm text-gray-300">
                      Toplam: ₺{order.totalPrice?.toFixed(2)}
                    </p>
                    <p className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</p>
                  </div>
                </div>

                {statusIndex !== -1 && statusLabel !== "Teslim Edildi" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md"
                  >
                    Siparişi İptal Et
                  </button>
                )}

                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="mt-2 ml-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md"
                >
                  Sipariş Detayları
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
