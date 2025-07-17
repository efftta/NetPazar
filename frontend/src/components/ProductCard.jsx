import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart } from 'react-feather';
import { useFavorites } from '../context/FavoriteContext';

const ProductCard = ({ product }) => {
    const { theme } = useTheme();
    const { addToCart } = useCart();
    const { favorites, toggleFavorite } = useFavorites();

    // API'nin temel URL'ini çevre değişkeninden alıyoruz.
    // Eğer backend'iniz http://localhost:5000/api adresinde çalışıyorsa
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

    // Resimlerin yüklendiği sunucu kök URL'i.
    // API_BASE_URL'den '/api' kısmını çıkararak resimlerin sunulduğu ana URL'i elde ediyoruz.
    const BASE_SERVER_URL = API_BASE_URL.includes('/api') ? API_BASE_URL.replace('/api', '') : API_BASE_URL;

    // getProductImageUrl fonksiyonuna artık ihtiyacımız yok.
    // URL'i doğrudan product.images[0].url'den oluşturacağız.

    const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
    const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
    const priceClass = theme === 'light' ? 'text-primary' : 'text-primary-light';
    const discountPriceClass = theme === 'light' ? 'text-green-600' : 'text-green-400';
    const oldPriceClass = theme === 'light' ? 'text-gray-500 line-through' : 'text-gray-400 line-through';
    const buttonClass = "bg-primary hover:bg-primary-dark text-white p-2 rounded-full transition duration-300 transform hover:scale-110";
    const favoriteButtonClass = (isFavorited) =>
        isFavorited
            ? "text-danger hover:text-red-700"
            : "text-gray-400 hover:text-red-500";

    const isFavorited = favorites.some(item => item._id === product._id);

    return (
        <motion.div
            className={`relative border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center justify-between ${cardBgClass} ${textClass}`}
            whileHover={{ y: -5, boxShadow: theme === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)' }}
            transition={{ duration: 0.2 }}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Link'e tıklamayı engeller
                    toggleFavorite(product);
                }}
                className={`absolute top-3 right-3 ${favoriteButtonClass(isFavorited)} z-10`}
                aria-label="Favorilere ekle/kaldır"
            >
                <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
            </button>
            <Link to={`/products/${product._id}`} className="flex flex-col items-center text-center w-full">
                {/* Konsola yazdırma satırları */}
                {console.log("ProductCard - Product:", product)}
                {console.log("ProductCard - Images array:", product.images)}
                {console.log("ProductCard - First image URL from data:", product.images && product.images.length > 0 ? product.images[0].url : "No URL in data")}
                {console.log("ProductCard - Constructed Image SRC:", product.images && product.images.length > 0
                    ? `${BASE_SERVER_URL}${product.images[0].url}`
                    : "Fallback image will be used")}

                <img
                    // GÖRSEL KAYNAĞINI BURADA GÜNCELLEDİK
                    src={product.images && product.images.length > 0
                        ? `${BASE_SERVER_URL}${product.images[0].url}`
                        : "https://dummyimage.com/400x300/ccc/fff&text=Urun+Gorseli+Mevcut+Degil"} // Daha güvenilir dummy servis
                    alt={product.name}
                    className="w-full h-48 object-contain mb-4 rounded" // object-contain kullanıldı
                />
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                {product.discountPrice ? (
                    <div className="flex flex-col items-center">
                        <span className={`${oldPriceClass} text-sm`}>{product.price} TL</span>
                        <span className={`${discountPriceClass} text-xl font-bold`}>{product.discountPrice} TL</span>
                    </div>
                ) : (
                    <span className={`${priceClass} text-xl font-bold`}>{product.price} TL</span>
                )}
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Link'e tıklamayı engeller
                    addToCart(product);
                }}
                className={`mt-4 ${buttonClass}`}
                aria-label="Sepete ekle"
            >
                <ShoppingCart size={20} />
            </button>
        </motion.div>
    );
};

export default ProductCard;