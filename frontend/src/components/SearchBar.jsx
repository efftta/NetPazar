// frontend/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; // Arama ikonu için lucide-react

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Formun varsayılan davranışını engelle
    if (searchTerm.trim()) {
      // Eğer arama terimi boş değilse Products sayfasına yönlendir
      // Arama terimini URL'de "search" query parametresi olarak gönder
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // Arama terimi boşsa Products sayfasına yönlendir (filtreleri temizleyebilir)
      navigate("/products");
    }
  };

  return (
    // max-w-lg sınıfı kaldırıldı, formun genişliği parent'ından gelecek
    <form onSubmit={handleSearch} className="flex items-center w-full relative">
      <input
        type="text"
        placeholder="Ürün, marka, kategori ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`flex-grow rounded-l-md border
                   ${ // Yeni eklenen veya güncellenen sınıflar:
                     // h-7: Yüksekliği 28px yapar.
                     // text-sm: Yazı boyutunu küçültür.
                     // pl-8: İkon için soldan boşluk bırakır.
                     "h-7 text-sm pl-8 pr-2"
                   }
                   ${
                     // Tema renklerine göre border ve text rengi ayarlayın
                     document.documentElement.classList.contains("dark")
                       ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                       : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                   } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {/* Search ikonu input'un içine yerleştirildi */}
      <Search size={16} className="absolute left-2 text-gray-500 dark:text-gray-400 pointer-events-none" />
      <button
        type="submit"
        // p-1.5: Butonun padding'i küçültüldü.
        // h-7: Butonun yüksekliği input ile aynı yapıldı.
        className="p-1.5 h-7 rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {/* Buton içindeki ikon boyutu küçültüldü */}
        <Search size={16} />
      </button>
      {/* Arama önerileri kısmı aynı kaldı */}
    </form>
  );
};

export default SearchBar;