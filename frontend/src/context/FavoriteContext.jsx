import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'nin temel URL'ini çevre değişkeninden alıyoruz.
  // .env'deki REACT_APP_API_BASE_URL zaten /api içeriyor.
  // Bu yüzden fetch çağrılarında tekrar "/api" eklemeyeceğiz.
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !token || authLoading) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // fetch call'larda API_BASE_URL zaten /api içerdiği için tekrar /api eklemeyin.
      const response = await fetch(`${API_BASE_URL}/favorites`, { 
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Favori çekme hatası: Yetkilendirme başarısız veya token geçersiz.");
          // Burada AuthContext'ten logout fonksiyonunu çağırabilirsiniz
          // useAuth().logout(); // Eğer böyle bir kullanım mümkünse
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `Favoriler yüklenirken bir hata oluştu: ${response.status}`);
      }

      const data = await response.json();
      setFavorites(data.map(favItem => ({
        ...favItem.product,
        _id: favItem.product._id,
        favoriteId: favItem._id
      })));
      console.log("Favoriler backend'den yüklendi:", data);
    } catch (err) {
      console.error("Favori yükleme hatası:", err);
      setError(err.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, authLoading, API_BASE_URL]);

  useEffect(() => {
    if (!authLoading) {
      fetchFavorites();
    }
  }, [fetchFavorites, authLoading]);

  const toggleFavorite = useCallback(async (product) => {
    if (!isAuthenticated) {
      console.warn("Favoriye eklemek için giriş yapmalısınız.");
      return;
    }
    if (!token) {
        console.error("Token mevcut değil. Favori işlemi yapılamaz.");
        setError("Yetkilendirme tokenı eksik. Lütfen tekrar giriş yapın.");
        return;
    }

    const isCurrentlyFavorited = favorites.some((item) => item._id === product._id);
    setError(null);

    try {
      let response;
      if (isCurrentlyFavorited) {
        // fetch call'larda API_BASE_URL zaten /api içerdiği için tekrar /api eklemeyin.
        response = await fetch(`${API_BASE_URL}/favorites/${product._id}`, { 
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Favoriden çıkarılırken bir hata oluştu: ${response.status}`);
        }
        setFavorites(favorites.filter((item) => item._id !== product._id));
        console.log("Ürün favorilerden çıkarıldı:", product.name);
      } else {
        // fetch call'larda API_BASE_URL zaten /api içerdiği için tekrar /api eklemeyin.
        response = await fetch(`${API_BASE_URL}/favorites`, { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `Favoriye eklenirken bir hata oluştu: ${response.status}`);
        }
        setFavorites((prevFavorites) => [...prevFavorites, { ...data.product, favoriteId: data._id }]);
        console.log("Ürün favorilere eklendi:", data.product.name);
      }
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
      setError(err.message);
    }
  }, [favorites, isAuthenticated, token, API_BASE_URL]);

  return (
    <FavoriteContext.Provider
      value={{ favorites, loading, error, toggleFavorite, fetchFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);