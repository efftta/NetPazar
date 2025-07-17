// frontend/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../api/authApi"; // Yeni API fonksiyonu

const Profile = () => {
  // AuthContext'ten user, token, setUser ve loading'i al
  const { user, token, setUser: setAuthUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue, // Form alanlarına başlangıç değeri atamak için
    formState: { errors },
    watch,
  } = useForm();

  // Kullanıcı bilgileri değiştiğinde form alanlarını doldur
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Şifre boşsa veya değişmediyse gönderme
      const updateData = { username: data.username, email: data.email };
      if (data.password) {
        updateData.password = data.password;
        updateData.confirmPassword = data.confirmPassword;
      }

      const updatedUser = await updateUserProfile(updateData, token);

      // AuthContext'teki kullanıcı bilgisini güncelle
      setAuthUser(updatedUser);

      setSuccessMessage("Profil başarıyla güncellendi!");
      // Şifre alanlarını sıfırla
      setValue("password", "");
      setValue("confirmPassword", "");
    } catch (error) {
      setErrorMessage(error.message || "Profil güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- BURADAKİ KONTROL KISMI DEĞİŞTİRİLDİ ---
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Profil</h2>
        <p className="text-gray-600 dark:text-gray-400">Profil bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Profil</h2>
        <p className="text-red-500 dark:text-red-400">Profil bilgileri için giriş yapmanız gerekmektedir.</p>
      </div>
    );
  }
  // --- DEĞİŞİKLİK BİTTİ ---

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">Profil Bilgileri</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              {...register("username", {
                required: "Kullanıcı adı zorunludur",
                minLength: {
                  value: 3,
                  message: "Kullanıcı adı en az 3 karakter olmalıdır.",
                },
              })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Adresi
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email adresi zorunludur",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Geçersiz email adresi",
                },
              })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)
            </label>
            <input
              id="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Şifre en az 6 karakter olmalıdır.",
                },
              })}
              type="password"
              placeholder="******"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Yeni Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Şifreler eşleşmiyor",
              })}
              type="password"
              placeholder="******"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {successMessage && (
            <p className="mt-4 text-center text-green-600 dark:text-green-400">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? "Güncelleniyor..." : "Profili Güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;