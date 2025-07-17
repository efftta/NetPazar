const baseUrl = "http://localhost:5000/api/products";

// Tüm ürünleri getir
export async function fetchProducts() {
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) throw new Error("Ürünler alınamadı.");
    return await res.json();
  } catch (error) {
    console.error("fetchProducts hatası:", error);
    return [];
  }
}

// Tekli filtreyle ürün getir (örnek: isBestSeller = true)
export async function fetchProductsByFilter(field, value) {
  try {
    if (!field || !value) return await fetchProducts();

    const url = `${baseUrl}?${field}=${encodeURIComponent(value)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Filtrelenmiş ürünler alınamadı.");
    return await res.json();
  } catch (error) {
    console.error(`fetchProductsByFilter hatası (${field}):`, error);
    return [];
  }
}

// Çoklu filtreyle ürün getir (örnek: { category: "Elektronik", isCampaign: "true" })
export async function fetchProductsByParams(paramsObj = {}) {
  try {
    const query = new URLSearchParams(paramsObj).toString();
    const url = `${baseUrl}?${query}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Filtreli ürünler alınamadı.");
    return await res.json();
  } catch (error) {
    console.error("fetchProductsByParams hatası:", error);
    return [];
  }
}
