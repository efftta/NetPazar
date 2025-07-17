import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdminProductList = ({
  categories = [],
  products = [],
  setProducts,
}) => {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameInputRef = useRef(null);

  useEffect(() => {
      console.log("Products props:", products);
      console.log("Categories props:", categories);
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let temp = [...products];

    if (filterCategory) {
      temp = temp.filter((p) => p.category === filterCategory);
    }
    if (filterMinPrice !== "") {
      temp = temp.filter((p) => p.price >= Number(filterMinPrice));
    }
    if (filterMaxPrice !== "") {
      temp = temp.filter((p) => p.price <= Number(filterMaxPrice));
    }

    setFilteredProducts(temp);
    setCurrentPage(1); // Filtre değişince sayfa başa dönsün
  }, [products, filterCategory, filterMinPrice, filterMaxPrice]);

  const handleFilterCategoryChange = (value) => {
    setFilterCategory(value);
  };

  const handleFilterMinPriceChange = (value) => {
    // Sadece sayılar ve nokta izin ver
    if (/^\d*\.?\d*$/.test(value)) {
      setFilterMinPrice(value);
    }
  };

  const handleFilterMaxPriceChange = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setFilterMaxPrice(value);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Ürünü silmek istediğinize emin misiniz?")) {
      try {
        setLoadingDelete(true);
        setErrorMessage("");
        await axios.delete(`/api/products/${id}`);
        const updatedProducts = products.filter((p) => p._id !== id);
        setProducts(updatedProducts);
      } catch (error) {
        setErrorMessage("Ürün silinirken hata oluştu.");
        console.error(error);
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name || "");
    setEditPrice(String(product.price || ""));
    setEditCategory(product.category || "");
    setErrorMessage("");
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const saveEdit = async () => {
    setErrorMessage("");
    if (!editName.trim()) {
      setErrorMessage("Ürün adı boş olamaz.");
      return;
    }
    if (editPrice === "" || isNaN(editPrice)) {
      setErrorMessage("Geçerli bir fiyat giriniz.");
      return;
    }
    if (!editCategory) {
      setErrorMessage("Kategori seçiniz.");
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      name: editName.trim(),
      price: Number(editPrice),
      category: editCategory,
    };

    try {
      setLoadingSave(true);
      const { data } = await axios.put(
        `/api/products/${updatedProduct._id}`,
        updatedProduct
      );

      const updatedProducts = products.map((p) =>
        p._id === data._id ? data : p
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      setErrorMessage("Ürün güncellenirken hata oluştu.");
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setErrorMessage("");
  };

  // Edit price input için Türkçe virgül kolaylığı
  const handleEditPriceChange = (value) => {
    // Virgül gelirse noktaya çevir
    value = value.replace(",", ".");
    // Sadece sayılar ve nokta
    if (/^\d*\.?\d*$/.test(value)) {
      setEditPrice(value);
    }
  };

  // Edit price input için blur'da nokta varsa sonrasında
  // ekstra sıfırları temizle (örneğin 12.00 -> 12)
  const handleEditPriceBlur = () => {
    if (editPrice.includes(".")) {
      let n = parseFloat(editPrice);
      if (!isNaN(n)) {
        setEditPrice(String(n));
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Ürün Yönetimi</h2>

      <div className="mb-4 flex gap-4 flex-wrap">
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={filterCategory}
          onChange={(e) => handleFilterCategoryChange(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.length > 0 &&
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Min Fiyat"
          className="bg-gray-800 text-white p-2 rounded w-24"
          value={filterMinPrice}
          onChange={(e) => handleFilterMinPriceChange(e.target.value)}
          inputMode="decimal"
          pattern="[0-9]*"
        />
        <input
          type="text"
          placeholder="Max Fiyat"
          className="bg-gray-800 text-white p-2 rounded w-24"
          value={filterMaxPrice}
          onChange={(e) => handleFilterMaxPriceChange(e.target.value)}
          inputMode="decimal"
          pattern="[0-9]*"
        />
      </div>

      {errorMessage && (
        <div className="mb-2 text-red-500 font-semibold">{errorMessage}</div>
      )}

      <table className="w-full text-left border-collapse border border-gray-700 text-white">
        <thead>
          <tr>
            <th className="border border-gray-600 p-2">ID</th>
            <th className="border border-gray-600 p-2">Görsel</th>
            <th className="border border-gray-600 p-2">Ürün Adı</th>
            <th className="border border-gray-600 p-2">Kategori</th>
            <th className="border border-gray-600 p-2">Fiyat</th>
            <th className="border border-gray-600 p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-4">
                Ürün bulunamadı.
              </td>
            </tr>
          ) : (
            currentProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-700">
                <td className="border border-gray-600 p-2">{product._id}</td>
                <td className="border border-gray-600 p-2">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span>Yok</span>
                  )}
                </td>
                <td className="border border-gray-600 p-2">{product.name}</td>
                <td className="border border-gray-600 p-2">
                  {categories.find((cat) => cat._id === product.category)
                    ?.name || "Kategori yok"}
                </td>
                <td className="border border-gray-600 p-2">{product.price} ₺</td>
                <td className="border border-gray-600 p-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    disabled={loadingDelete || loadingSave}
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    disabled={loadingDelete || loadingSave}
                  >
                    {loadingDelete ? "Siliniyor..." : "Sil"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2 text-white">
        <button
          disabled={currentPage === 1 || loadingDelete || loadingSave}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className={`px-3 py-1 rounded ${
            currentPage === 1 || loadingDelete || loadingSave
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Önceki
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            disabled={loadingDelete || loadingSave}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages || loadingDelete || loadingSave}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages || loadingDelete || loadingSave
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Sonraki
        </button>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Ürün Düzenle
            </h3>
            <div className="mb-3">
              <label className="block mb-1 text-white font-medium">Ürün Adı</label>
              <input
                ref={nameInputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
                disabled={loadingSave}
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-white font-medium">Fiyat (₺)</label>
              <input
                type="text"
                value={editPrice}
                onChange={(e) => handleEditPriceChange(e.target.value)}
                onBlur={handleEditPriceBlur}
                className="w-full p-2 rounded bg-gray-800 text-white"
                disabled={loadingSave}
                inputMode="decimal"
                pattern="[0-9]*"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-white font-medium">Kategori</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
                disabled={loadingSave}
              >
                <option value="">Kategori Seçiniz</option>
                {categories.length > 0 &&
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {errorMessage && (
              <div className="mb-2 text-red-500 font-semibold">{errorMessage}</div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={cancelEdit}
                disabled={loadingSave}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                İptal
              </button>
              <button
                onClick={saveEdit}
                disabled={loadingSave}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loadingSave ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
