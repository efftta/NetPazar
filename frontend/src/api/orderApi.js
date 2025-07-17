const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Yeni sipariş oluşturma
export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sipariş oluşturulamadı.");
    }

    return await response.json();
  } catch (error) {
    console.error("createOrder API hatası:", error);
    throw error;
  }
};

// Kullanıcının siparişlerini getirme
export const fetchUserOrders = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sipariş geçmişi alınamadı.");
    }

    return await response.json();
  } catch (error) {
    console.error("fetchUserOrders API hatası:", error);
    throw error;
  }
};

// Belirli bir siparişin detaylarını getirme
export const fetchOrderDetail = async (orderId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sipariş detayı alınamadı.");
    }

    return await response.json();
  } catch (error) {
    console.error(`fetchOrderDetail API hatası (ID: ${orderId}):`, error);
    throw error;
  }
};

// Siparişi iptal etme (PUT veya PATCH metodunu backend API'ne göre düzenle)
export const cancelOrderApi = async (orderId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sipariş iptal edilemedi.");
    }

    return await response.json();
  } catch (error) {
    console.error(`cancelOrderApi hatası (ID: ${orderId}):`, error);
    throw error;
  }
};
