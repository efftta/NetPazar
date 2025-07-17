const API_URL = "http://localhost:5000/api/categories";

export const fetchCategories = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Kategori alınırken hata oluştu.");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
