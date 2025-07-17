import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext";
import { Heart } from "react-feather";
import { useTheme } from "../context/ThemeContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [errorProduct, setErrorProduct] = useState(null);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [errorRelated, setErrorRelated] = useState(null);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fakeComments = [
    {
      _id: "fake1",
      userName: "Ahmet Yılmaz",
      date: new Date().toISOString(),
      text: "Ürün gerçekten çok kaliteli, kesinlikle tavsiye ederim!",
    },
    {
      _id: "fake2",
      userName: "Elif Demir",
      date: new Date().toISOString(),
      text: "Fiyat performans açısından çok başarılı bir ürün.",
    },
    {
      _id: "fake3",
      userName: "Murat Kaya",
      date: new Date().toISOString(),
      text: "Hızlı kargo ve güzel paketleme için teşekkürler.",
    },
  ];

  // API_BASE_URL'i direkt backend adresini gösterecek şekilde ayarlayın
  // Örneğin, eğer backend'iniz http://localhost:5000/api adresinde çalışıyorsa,
  // görseller http://localhost:5000/uploads adresinden servis edilecektir.
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
  
  // Görsel kök URL'si için API_BASE_URL'den '/api' kısmını çıkarıyoruz
  const BASE_SERVER_URL = API_BASE_URL.includes('/api') ? API_BASE_URL.replace('/api', '') : API_BASE_URL;

  // getProductImageUrl fonksiyonuna artık ihtiyacınız yok, doğrudan URL'yi oluşturacağız.

  useEffect(() => {
    setLoadingProduct(true);
    setErrorProduct(null);

    fetch(`${API_BASE_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Ürün bulunamadı.");
          throw new Error("Ürün yüklenirken bir hata oluştu.");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        console.log("Ürün Detay Sayfası Yüklendi:", data);
        // Artık data.image yerine data.images[0].url'i kontrol ediyoruz
        console.log("product.images[0].url değeri (backend'den gelen):", data.images && data.images.length > 0 ? data.images[0].url : "Görsel URL'si yok");
        setLoadingProduct(false);
      })
      .catch((err) => {
        console.error("Ürün detay hatası:", err);
        setErrorProduct(err.message);
        setProduct(null);
        setLoadingProduct(false);
      });
  }, [id, API_BASE_URL]);

  useEffect(() => {
    if (product?.category) {
      setLoadingRelated(true);
      setErrorRelated(null);

      fetch(
        `${API_BASE_URL}/products?categoryName=${encodeURIComponent(product.category.name)}&exclude=${product._id}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("İlgili ürünler yüklenemedi.");
          return res.json();
        })
        .then((data) => {
          setRelatedProducts(data);
          setLoadingRelated(false);
        })
        .catch((err) => {
          console.error("İlgili ürünler çekilirken hata:", err);
          setErrorRelated("İlgili ürünler yüklenirken bir sorun oluştu.");
          setLoadingRelated(false);
        });
    } else {
      setRelatedProducts([]);
      setLoadingRelated(false);
    }
  }, [product, API_BASE_URL]);

  useEffect(() => {
    if (!product) return;

    setLoadingComments(true);
    setErrorComments(null);

    fetch(`${API_BASE_URL}/products/${id}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error("Yorumlar yüklenemedi.");
        return res.json();
      })
      .then((data) => {
        setComments(data);
        setLoadingComments(false);
      })
      .catch((err) => {
        console.error("Yorumlar çekilirken hata:", err);
        setErrorComments("Yorumlar yüklenirken bir hata oluştu.");
        setLoadingComments(false);
      });
  }, [id, product, API_BASE_URL]);

  const isFavorited = favorites.some((item) => item._id === product?._id);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleFavorite(product);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!newComment.trim()) return;

    setSubmittingComment(true);

    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/products/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user._id,
        userName: user.name || user.email,
        text: newComment.trim(),
        date: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Yorum gönderilemedi.");
        return res.json();
      })
      .then((savedComment) => {
        setComments((prev) => [savedComment, ...prev]);
        setNewComment("");
        setSubmittingComment(false);
      })
      .catch((err) => {
        console.error("Yorum gönderme hatası:", err);
        alert("Yorum gönderilirken bir hata oluştu.");
        setSubmittingComment(false);
      });
  };

  const containerBgClass = theme === "light" ? "bg-white" : "bg-gray-900";
  const textClass = theme === "light" ? "text-gray-900" : "text-white";
  const cardBgClass = theme === "light" ? "bg-gray-50" : "bg-gray-800";
  const buttonClass = "bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded transition";
  const favoriteButtonClass = isFavorited ? "bg-danger hover:bg-red-700" : "bg-muted hover:bg-gray-600";
  const relatedCardHoverClass = "hover:shadow-custom-medium transition-shadow duration-300";

  if (loadingProduct) return <p className={`text-center mt-10 ${textClass}`}>Ürün yükleniyor...</p>;
  if (errorProduct) return <p className="text-center mt-10 text-danger">{errorProduct}</p>;
  if (!product) return <p className={`text-center mt-10 ${textClass}`}>Ürün bulunamadı.</p>;

  const displayedComments = [...fakeComments, ...comments];

  return (
    <div className={`container mx-auto px-4 py-8 min-h-screen ${containerBgClass} ${textClass}`}>
      {/* Ürün Görseli ve Bilgiler Bölümü */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <img
            // GÖRSEL KAYNAĞINI BURADA GÜNCELLEDİK
            src={product.images && product.images.length > 0
              ? `${BASE_SERVER_URL}${product.images[0].url}`
              : "https://dummyimage.com/600x400/ccc/fff&text=Urun+Gorseli+Mevcut+Degil"} // Daha güvenilir bir dummy servis
            alt={product.name}
            className="max-w-xs max-h-72 object-contain mx-auto block rounded shadow"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl text-primary font-semibold">
            {product.discountPrice || product.price} TL
          </p>
          <p>{product.description}</p>
          <div className="flex gap-4">
            <button
              className={buttonClass}
              onClick={handleAddToCart}
            >
              Sepete Ekle
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`text-white px-4 py-2 rounded flex items-center gap-2 ${favoriteButtonClass}`}
            >
              <Heart size={20} />
              {isFavorited ? "Favorilerden Kaldır" : "Favorilere Ekle"}
            </button>
          </div>
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <div className={`mt-16 ${cardBgClass} p-6 rounded-lg shadow-custom-medium`}>
        <h2 className="text-3xl font-bold mb-6">Yorumlar</h2>

        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            className="w-full p-3 border rounded mb-2"
            placeholder="Yorumunuzu yazın..."
          ></textarea>
          <button type="submit" disabled={submittingComment} className={buttonClass}>
            {submittingComment ? "Gönderiliyor..." : "Yorum Gönder"}
          </button>
        </form>

        {loadingComments ? (
          <p>Yorumlar yükleniyor...</p>
        ) : errorComments ? (
          <p className="text-danger">{errorComments}</p>
        ) : displayedComments.length === 0 ? (
          <p>Henüz yorum yok.</p>
        ) : (
          displayedComments.map((comment) => (
            <div key={comment._id} className="mb-4 border-b pb-2">
              <p className="font-semibold">{comment.userName}</p>
              <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleString()}</p>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>

      {/* İlgili Ürünler Bölümü */}
      <div className={`mt-16 ${cardBgClass} p-6 rounded-lg shadow-custom-medium`}>
        <h2 className="text-3xl font-bold mb-6 text-center">İlgili Ürünler</h2>

        {loadingRelated ? (
          <p className="text-center">İlgili ürünler yükleniyor...</p>
        ) : errorRelated ? (
          <p className="text-danger text-center">{errorRelated}</p>
        ) : relatedProducts.length === 0 ? (
          <p className="text-center">İlgili ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct._id}
                className={`border rounded-lg p-4 cursor-pointer ${relatedCardHoverClass}`}
                onClick={() => navigate(`/products/${relProduct._id}`)}
              >
                <img
                  // GÖRSEL KAYNAĞINI BURADA DA GÜNCELLEDİK
                  src={relProduct.images && relProduct.images.length > 0
                    ? `${BASE_SERVER_URL}${relProduct.images[0].url}`
                    : "https://dummyimage.com/200x200/ccc/fff&text=Urun+Gorseli+Mevcut+Degil"} // İlgili ürünler için daha küçük dummy
                  alt={relProduct.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-2 text-lg font-semibold">{relProduct.name}</h3>
                <p className="text-primary font-bold text-xl">
                  {relProduct.discountPrice || relProduct.price} TL
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;