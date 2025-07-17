import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Tema için

const CategoriesPage = () => {
  const { theme } = useTheme(); // Tema bilgisini al
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorProducts, setErrorProducts] = useState(null);
  const location = useLocation();

  // URL'den kategori adını al
  const queryParams = new URLSearchParams(location.search);
  const selectedCategoryName = queryParams.get('name'); // URL'den gelen kategori adı

  // Kategori listesini çekme
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Kategoriler yüklenemedi.');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Kategorileri çekerken hata:", err);
        setErrorCategories('Kategoriler yüklenirken bir sorun oluştu.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Seçilen kategoriye veya tümüne göre ürünleri çekme
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setErrorProducts(null);
      try {
        let url = '/api/products';
        if (selectedCategoryName) {
          // Kategori ID'sini bulmak için (şu an sadece isimle filtreleyeceğiz,
          // ancak ürün modelinizde kategori ID'si varsa, önce ID'yi bulmanız gerekir)
          // Şimdilik backend'in kategori adına göre filtreleme yapabildiğini varsayıyoruz.
          url = `/api/products?categoryName=${selectedCategoryName}`; // Varsayım: backend bu query'yi işleyebilir
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Ürünler yüklenemedi.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Ürünleri çekerken hata:", err);
        setErrorProducts('Ürünler yüklenirken bir sorun oluştu.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryName]); // selectedCategoryName değiştiğinde yeniden çek

  const containerBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const cardBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const cardTextClass = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const buttonClass = "bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded transition-colors";
  const categoryLinkClass = "block p-2 rounded-md transition-colors";


  return (
    <div className={`container mx-auto px-4 py-6 min-h-screen ${containerBgClass} ${textClass}`}>
      <h1 className="text-3xl font-bold mb-6 text-center">
        {selectedCategoryName ? `${selectedCategoryName} Kategorisindeki Ürünler` : 'Tüm Kategoriler ve Ürünleri'}
      </h1>

      {/* Kategori Listesi */}
      <div className={`mb-8 p-4 rounded-lg shadow-custom-light ${cardBgClass}`}>
        <h2 className="text-xl font-semibold mb-4">Kategoriler</h2>
        {loadingCategories ? (
          <p className="text-center">Kategoriler yükleniyor...</p>
        ) : errorCategories ? (
          <p className="text-danger text-center">{errorCategories}</p>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Link 
              to="/categories" 
              className={`${categoryLinkClass} ${!selectedCategoryName ? 'bg-primary text-white' : (theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600')}`}
            >
              Tümü
            </Link>
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/categories?name=${category.name}`}
                className={`${categoryLinkClass} ${selectedCategoryName === category.name ? 'bg-primary text-white' : (theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-700 hover:bg-gray-600')}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Henüz hiç kategori yok.</p>
        )}
      </div>

      {/* Ürün Listesi */}
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {selectedCategoryName ? `${selectedCategoryName} Ürünleri` : 'Tüm Ürünler'}
      </h2>
      {loadingProducts ? (
        <p className="text-center mt-6">Ürünler yükleniyor...</p>
      ) : errorProducts ? (
        <p className="text-danger text-center mt-6">{errorProducts}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link to={`/products/${product._id}`} key={product._id} className={`block rounded-lg shadow-custom-medium overflow-hidden ${cardBgClass} ${cardTextClass} hover:shadow-custom-medium transition-shadow duration-300`}>
              <img
                src={product.image || 'https://via.placeholder.com/400x300?text=Ürün+Görseli'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-muted text-sm mb-3 line-clamp-2">{product.description}</p>
                {product.discountPrice ? (
                  <div className="flex items-baseline mb-2">
                    <span className="text-xl font-bold text-green-500 mr-2">{product.discountPrice} TL</span>
                    <span className="text-sm line-through text-red-500">{product.price} TL</span>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-primary mb-2">{product.price} TL</p>
                )}
                <button 
                  onClick={(e) => { e.preventDefault(); /* addToCart(product) */ alert("Sepete ekleme fonksiyonu burada çalışacak!"); }} 
                  className={`mt-3 w-full ${buttonClass}`}
                >
                  Sepete Ekle
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center mt-6 text-muted">Gösterilecek ürün bulunamadı.</p>
      )}
    </div>
  );
};

export default CategoriesPage;