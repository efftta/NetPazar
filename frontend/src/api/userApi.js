// frontend/src/api/userApi.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// KULLANICI ADRES YÖNETİMİ FONKSİYONLARI
// Kullanıcının tüm adreslerini getir
export const fetchUserAddresses = async (token) => { // Token parametresini eklemeyi unutmayın
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/addresses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Adresler alınamadı.");
    }
    return await response.json();
  } catch (error) {
    console.error("fetchUserAddresses API hatası:", error);
    throw error;
  }
};

// Yeni adres ekle
export const addAddress = async (addressData, token) => { // Token parametresini eklemeyi unutmayın
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Adres eklenemedi.");
    }
    return await response.json();
  } catch (error) {
    console.error("addAddress API hatası:", error);
    throw error;
  }
};

// Adresi güncelle
export const updateAddress = async (addressId, updatedData, token) => { // Token parametresini eklemeyi unutmayın
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/addresses/${addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Adres güncellenemedi.");
    }
    return await response.json();
  } catch (error) {
    console.error("updateAddress API hatası:", error);
    throw error;
  }
};

// Adresi sil
export const deleteAddress = async (addressId, token) => { // Token parametresini eklemeyi unutmayın
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Adres silinemedi.");
    }
    return { success: true, message: "Adres başarıyla silindi." };
  } catch (error) {
    console.error("deleteAddress API hatası:", error);
    throw error;
  }
};


// ÖDEME YÖNTEMLERİ FONKSİYONLARI
// Kullanıcının tüm ödeme yöntemlerini getir
export const fetchUserPaymentMethods = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/payment-methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme yöntemleri alınamadı.");
    }
    return await response.json();
  } catch (error) {
    console.error("fetchUserPaymentMethods API hatası:", error);
    throw error;
  }
};

// Yeni ödeme yöntemi (kart) ekle
export const addPaymentMethod = async (paymentMethodData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/payment-methods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentMethodData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme yöntemi eklenemedi.");
    }
    return await response.json();
  } catch (error) {
    console.error("addPaymentMethod API hatası:", error);
    throw error;
  }
};

// Ödeme yöntemini (kartı) güncelle
export const updatePaymentMethod = async (paymentMethodId, paymentMethodData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/payment-methods/${paymentMethodId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentMethodData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme yöntemi güncellenemedi.");
    }
    return await response.json();
  } catch (error) {
    console.error("updatePaymentMethod API hatası:", error);
    throw error;
  }
};

// Ödeme yöntemini (kartı) sil
export const deletePaymentMethod = async (paymentMethodId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/payment-methods/${paymentMethodId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ödeme yöntemi silinemedi.");
    }
    return { success: true, message: "Ödeme yöntemi başarıyla silindi." };
  } catch (error) {
    console.error("deletePaymentMethod API hatası:", error);
    throw error;
  }
};