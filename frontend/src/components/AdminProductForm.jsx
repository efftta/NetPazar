import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    image: "",
    isBestSeller: false,
    isCampaign: false,
    isNewProduct: false,
    stock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Kategori verilerini çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Kategori çekme hatası:", err);
      }
    };
    fetchCategories();
  }, []);

  // Form değerlerini güncelle
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form temizleme
  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      discountPrice: "",
      image: "",
      isBestSeller: false,
      isCampaign: false,
      isNewProduct: false,
      stock: 0,
    });
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name || !formData.category || !formData.price) {
      setMessage({ type: "error", text: "Zorunlu alanlar boş bırakılamaz!" });
      return;
    }

    if (Number(formData.price) < 0 || Number(formData.stock) < 0) {
      setMessage({ type: "error", text: "Fiyat ve stok negatif olamaz!" });
      return;
    }

    if (formData.discountPrice && Number(formData.discountPrice) < 0) {
      setMessage({ type: "error", text: "İndirimli fiyat negatif olamaz!" });
      return;
    }

    try {
      setLoading(true);
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : undefined,
        stock: Number(formData.stock),
      };

      await axios.post("/api/products", productData);
      setMessage({ type: "success", text: "Ürün başarıyla eklendi!" });
      clearForm();
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Ürün ekleme hatası:", err);
      setMessage({ type: "error", text: "Ürün eklenirken hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 text-white"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">
        Yeni Ürün Ekle
      </h2>

      {message && (
        <div
          className={`p-3 rounded text-center font-semibold ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Ürün Adı"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
      />

      <textarea
        name="description"
        placeholder="Ürün Açıklaması"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
      >
        <option value="">Kategori Seçiniz</option>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))
        ) : (
          <option disabled>Kategori bulunamadı</option>
        )}
      </select>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="price"
          placeholder="Fiyat"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
        />

        <input
          type="number"
          name="discountPrice"
          placeholder="İndirimli Fiyat (opsiyonel)"
          value={formData.discountPrice}
          onChange={handleChange}
          min="0"
          step="0.01"
          className="p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <input
        type="text"
        name="image"
        placeholder="Resim URL"
        value={formData.image}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
      />
      {formData.image && (
        <img
          src={formData.image}
          alt="Önizleme"
          className="w-32 h-32 object-contain mt-2 border border-gray-700 rounded"
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleChange}
          />
          Çok Satan
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isCampaign"
            checked={formData.isCampaign}
            onChange={handleChange}
          />
          Kampanya
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isNewProduct"
            checked={formData.isNewProduct}
            onChange={handleChange}
          />
          Yeni Ürün
        </label>
      </div>

      <input
        type="number"
        name="stock"
        placeholder="Stok"
        value={formData.stock}
        onChange={handleChange}
        min="0"
        required
        className="w-full p-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-indigo-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded p-3 font-semibold disabled:opacity-50"
      >
        {loading ? "Yükleniyor..." : "Ürünü Kaydet"}
      </button>
    </form>
  );
};

export default AdminProductForm;
