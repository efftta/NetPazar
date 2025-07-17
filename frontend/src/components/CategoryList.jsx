// src/components/CategoryList.jsx
import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/categoryApi";

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        setCategories(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Kategori alınırken hata oluştu:", err);
        setError("Kategoriler yüklenirken hata oluştu.");
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (categoryId) => {
    const selected = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(selected);
    onCategorySelect(selected);
  };

  if (loading) return <div className="text-white">Kategoriler yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-white mb-2">Kategoriler</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded transition ${
            selectedCategory === null
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          Tüm Ürünler
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`px-4 py-2 rounded transition ${
              selectedCategory === cat._id
                ? "bg-blue-600 text-white"
                : "bg-blue-700 text-white hover:bg-blue-600"
            }`}
            onClick={() => handleCategoryClick(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
