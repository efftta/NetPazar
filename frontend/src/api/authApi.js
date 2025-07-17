const API_BASE_URL = "/api/auth";

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Giriş başarısız.");
    }
    return data;
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};

export const registerUser = async (username, email, password, confirmPassword) => {
  try {
    if (password !== confirmPassword) {
      throw new Error("Şifreler eşleşmiyor.");
    }
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Kayıt başarısız.");
    }
    return data;
  } catch (error) {
    console.error("Register API Error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData, token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Profil güncelleme başarısız.");
    }
    return data;
  } catch (error) {
    console.error("Profile Update API Error:", error);
    throw error;
  }
};

// Şifre sıfırlama (ileri kullanım için)
export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Şifre sıfırlama talebi başarısız.");
    }
    return data;
  } catch (error) {
    console.error("Forgot Password API Error:", error);
    throw error;
  }
};

// Şifre sıfırlama - yeni şifre ile güncelleme
export const resetPassword = async (email, newPassword) => {
  try {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Şifre sıfırlama başarısız.");
    }
    return data;
  } catch (error) {
    console.error("Reset Password API Error:", error);
    throw error;
  }
};
